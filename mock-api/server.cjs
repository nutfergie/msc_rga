const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

/**
 * Generate RGA Number in format YYNNNNNNNN
 * YY = last 2 digits of Buddhist year (พ.ศ.)
 * NNNNNNNN = 8-digit sequence number with leading zeros
 */
function generateRGANumber() {
  const dbPath = path.join(__dirname, 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  
  // Get current Buddhist year (พ.ศ.)
  const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist year
  const yearSuffix = String(currentYear).slice(-2); // Get last 2 digits
  
  // Get the last RGA document to determine next sequence number
  const rgaDocuments = db.rgaDocuments || [];
  let sequenceNumber = 1;
  
  if (rgaDocuments.length > 0) {
    // Find the highest sequence number for the current year
    const currentYearDocs = rgaDocuments.filter(doc => 
      doc.rgaNumber && doc.rgaNumber.startsWith(yearSuffix)
    );
    
    if (currentYearDocs.length > 0) {
      const lastDoc = currentYearDocs[currentYearDocs.length - 1];
      const lastSequence = parseInt(lastDoc.rgaNumber.slice(2), 10);
      sequenceNumber = lastSequence + 1;
    }
  }
  
  // Format sequence number with leading zeros (8 digits)
  const sequenceStr = String(sequenceNumber).padStart(8, '0');
  
  return `${yearSuffix}${sequenceStr}`;
}

/**
 * Custom POST /order endpoint
 * Searches for an order by orderYear and orderNumber
 */
server.post('/order', (req, res) => {
  const { orderYear, orderNumber } = req.body;
  
  console.log(`[POST /order] Searching for order: Year=${orderYear}, Number=${orderNumber}`);
  
  // Validate input
  if (!orderYear || !orderNumber) {
    console.log('[POST /order] Missing orderYear or orderNumber');
    return res.status(400).json({ 
      error: 'กรุณาระบุปีและหมายเลขคำสั่งซื้อ' 
    });
  }
  
  const db = router.db;
  const order = db.get('orders')
    .find({ orderYear, orderNumber })
    .value();
  
  if (order) {
    console.log(`[POST /order] Order found: ${order.orderNumber}`);
    res.json(order);
  } else {
    console.log('[POST /order] Order not found');
    res.status(404).json({ 
      error: 'ไม่พบคำสั่งซื้อ' 
    });
  }
});

/**
 * Custom POST /rgaReason endpoint
 * Returns all RGA reasons (main reasons and sub reasons)
 */
server.post('/rgaReason', (req, res) => {
  console.log('[POST /rgaReason] Fetching RGA reasons');
  
  const db = router.db;
  const reasons = db.get('rgaReasons').value();
  
  if (reasons && reasons.length > 0) {
    console.log(`[POST /rgaReason] Returning ${reasons.length} main reasons`);
    res.json(reasons);
  } else {
    console.log('[POST /rgaReason] No reasons found');
    res.status(404).json({ 
      error: 'ไม่พบข้อมูลเหตุผล RGA' 
    });
  }
});

/**
 * Custom POST /rgaSubmit endpoint
 * Creates a new RGA document with auto-generated RGA number
 */
server.post('/rgaSubmit', (req, res) => {
  console.log('[POST /rgaSubmit] Creating RGA document');
  console.log('[POST /rgaSubmit] Request body:', JSON.stringify(req.body, null, 2));
  
  const { orderYear, orderNumber, mainReasonId, subReasonId, lineItems, remark } = req.body;
  
  // Validate required fields
  if (!orderYear || !orderNumber) {
    console.log('[POST /rgaSubmit] Missing orderYear or orderNumber');
    return res.status(400).json({ 
      error: 'กรุณาระบุปีและหมายเลขคำสั่งซื้อ' 
    });
  }
  
  if (!mainReasonId || !subReasonId) {
    console.log('[POST /rgaSubmit] Missing mainReasonId or subReasonId');
    return res.status(400).json({ 
      error: 'กรุณาเลือกเหตุผลในการยกเลิก' 
    });
  }
  
  if (!lineItems || lineItems.length === 0) {
    console.log('[POST /rgaSubmit] Missing or empty lineItems');
    return res.status(400).json({ 
      error: 'กรุณาระบุรายการสินค้าที่ต้องการยกเลิก' 
    });
  }
  
  // Validate that at least one item has cancelQty > 0
  const hasValidCancelQty = lineItems.some(item => item.cancelQty && item.cancelQty > 0);
  if (!hasValidCancelQty) {
    console.log('[POST /rgaSubmit] No items with valid cancelQty');
    return res.status(400).json({ 
      error: 'กรุณาระบุจำนวนสินค้าที่ต้องการยกเลิกอย่างน้อย 1 รายการ' 
    });
  }
  
  try {
    // Generate RGA number
    const rgaNumber = generateRGANumber();
    console.log(`[POST /rgaSubmit] Generated RGA number: ${rgaNumber}`);
    
    // Create RGA document
    const rgaDocument = {
      rgaNumber,
      orderYear,
      orderNumber,
      mainReasonId,
      subReasonId,
      remark: remark || '',
      lineItems: lineItems.filter(item => item.cancelQty && item.cancelQty > 0),
      createdDate: new Date().toISOString(),
      status: 'pending'
    };
    
    // Save to database
    const db = router.db;
    db.get('rgaDocuments')
      .push(rgaDocument)
      .write();
    
    console.log(`[POST /rgaSubmit] RGA document created successfully: ${rgaNumber}`);
    res.status(201).json(rgaDocument);
  } catch (error) {
    console.error('[POST /rgaSubmit] Error creating RGA document:', error);
    res.status(500).json({ 
      error: 'ไม่สามารถสร้าง RGA ได้ กรุณาลองใหม่อีกครั้ง' 
    });
  }
});

// Use default router for other routes
server.use(router);

const PORT = 4001;
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('Available endpoints:');
  console.log(`  POST http://localhost:${PORT}/order`);
  console.log(`  POST http://localhost:${PORT}/rgaReason`);
  console.log(`  POST http://localhost:${PORT}/rgaSubmit`);
  console.log('='.repeat(60));
});
