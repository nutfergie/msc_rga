# เอกสารการออกแบบ (Design Document)

## ภาพรวม (Overview)

ระบบ RGA Web Application เป็น Single Page Application (SPA) ที่พัฒนาด้วย React และ Vite โดยใช้ MUI เป็น UI framework หลัก ระบบประกอบด้วย 2 หน้าหลัก:

1. **หน้าค้นหาคำสั่งซื้อ (Order Search Page)**: ให้ผู้ใช้กรอกปีและหมายเลขคำสั่งซื้อเพื่อค้นหา
2. **หน้าสร้าง RGA (RGA Creation Page)**: แสดงรายละเอียดคำสั่งซื้อ ให้เลือกเหตุผลการยกเลิก และระบุจำนวนสินค้าที่ต้องการยกเลิก

ระบบออกแบบให้รองรับการเปลี่ยนจาก Mock API (JSON Server) ไปยัง Real API ได้ง่ายโดยการเปลี่ยน base URL เท่านั้น

## สถาปัตยกรรม (Architecture)

### โครงสร้างโปรเจค

```
rga-web-application/
├── src/
│   ├── components/          # React components
│   │   ├── OrderSearch.jsx
│   │   ├── RGAForm.jsx
│   │   ├── OrderInfo.jsx
│   │   ├── ReasonSelector.jsx
│   │   └── LineItemsTable.jsx
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── hooks/               # Custom React hooks
│   │   └── useRGAReasons.js
│   ├── utils/               # Utility functions
│   │   └── validation.js
│   ├── config/              # Configuration
│   │   └── apiConfig.js
│   ├── state/               # Recoil state management
│   │   ├── atoms.js         # Recoil atoms
│   │   └── selectors.js     # Recoil selectors (if needed)
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── mock-api/                # JSON Server mock data
│   ├── db.json
│   └── routes.json
└── package.json
```

**หมายเหตุ**: โปรเจคนี้ใช้ JavaScript ธรรมดา (ไม่ใช้ TypeScript) ไฟล์ทั้งหมดจะเป็นนามสกุล `.js` และ `.jsx`

### การไหลของข้อมูล (Data Flow)

```
User Input → Component → API Service → Backend API
                ↓
            State Update
                ↓
            UI Re-render
```

### การจัดการ State

ใช้ **Recoil** เป็น state management library หลักสำหรับจัดการ global state ร่วมกับ React Hooks:

**Recoil Atoms** (Global State):
- `orderDataState`: เก็บข้อมูลคำสั่งซื้อที่ค้นหาได้
- `rgaReasonsState`: เก็บรายการเหตุผล RGA ทั้งหมด
- `selectedMainReasonState`: เก็บเหตุผลหลักที่เลือก
- `selectedSubReasonState`: เก็บเหตุผลรองที่เลือก
- `lineItemsWithCancelQtyState`: เก็บรายการสินค้าพร้อมจำนวนที่ต้องการยกเลิก

**React Hooks**:
- `useRecoilState`: สำหรับอ่านและเขียน state
- `useRecoilValue`: สำหรับอ่าน state อย่างเดียว
- `useSetRecoilState`: สำหรับเขียน state อย่างเดียว
- `useEffect`: สำหรับ side effects (API calls)
- Custom hooks: สำหรับ logic ที่ใช้ซ้ำ

## การออกแบบ UI Layout (UI Layout Design)

### หน้าที่ 1: Order Search Page

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                    Order No                         │
│                                                     │
│              [Year] [Order Number]                  │
│                                                     │
│                   [Search Button]                   │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Desktop Layout (> 960px)**:
- ฟอร์มค้นหาวางตรงกลางหน้าจอ (centered)
- ใช้ MUI Container component (maxWidth="sm")
- Label "Order No" อยู่ด้านบน
- TextField สำหรับ Year: ความกว้าง 100px (4 หลัก)
- TextField สำหรับ Order Number: ความกว้างเต็มที่เหลือ
- Year และ Order Number วางในแนวนอน (horizontal layout)
- ปุ่ม Search วางด้านล่าง TextField
- ระยะห่างระหว่าง elements: 16-24px

**Tablet Layout (600px - 960px)**:
- เหมือน Desktop แต่ลด padding ของ Container
- TextField ปรับขนาดตามหน้าจอ

**Mobile Layout (< 600px)**:
- Year และ Order Number ยังคงวางแนวนอน
- Year TextField: ความกว้าง 80px
- Order Number TextField: flex-grow เต็มพื้นที่
- ปุ่ม Search: full width
- ลด font size และ padding เล็กน้อย

**MUI Components**:
- Container (maxWidth="sm")
- Box (สำหรับ layout wrapper)
- Typography (สำหรับ "Order No" label)
- TextField (สำหรับ Year และ Order Number)
- Button (สำหรับ Search)
- CircularProgress (สำหรับ loading state)
- Alert (สำหรับแสดง error)

### หน้าที่ 2: RGA Creation Page

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│ RGA Info                                            │
│                                                     │
│   reason      [Dropdown ▼]                         │
│   subreason   [Dropdown ▼]                         │
│   remark      [Text Area                      ]    │
│               [                               ]    │
│               [                               ]    │
│                                                     │
│   Order detail (RGA selection)                     │
│                                      Balance: xxxxx│
│                                      Return Qty    │
│                                         (input)    │
│   ┌───────────────────────────────────────────┐   │
│   │ xxxxx          [2]          yyyyy         │   │
│   └───────────────────────────────────────────┘   │
│   ┌───────────────────────────────────────────┐   │
│   │ xxxxx          [ ]          yyyyy         │   │
│   └───────────────────────────────────────────┘   │
│   ┌───────────────────────────────────────────┐   │
│   │                [ ]                        │   │
│   └───────────────────────────────────────────┘   │
│   ┌───────────────────────────────────────────┐   │
│   │                [ ]                        │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
│   Tax selected: yyyyyyy    Total selected: yyyyyyy │
│                                        [Submit]    │
└─────────────────────────────────────────────────────┘
```

**Desktop Layout (> 960px)**:
- ใช้ MUI Container (maxWidth="lg")
- แบ่งเป็น 2 sections หลัก:
  1. **RGA Info Section** (ด้านบน):
     - Label "RGA Info" เป็น heading
     - Reason dropdown: ความกว้าง 300px
     - Subreason dropdown: ความกว้าง 300px
     - Remark textarea: full width, height 120px
     - ใช้ Grid layout (2 columns สำหรับ reason/subreason)
  
  2. **Order Detail Section** (ด้านล่าง):
     - Label "Order detail (RGA selection)" เป็น heading
     - แสดง "Balance: xxxxx" ชิดขวา
     - แสดง "Return Qty (input)" ชิดขวา
     - Line items แสดงเป็น Card/Box แต่ละรายการ (ไม่ใช่ table)
     - แต่ละ line item มี:
       - Item code (xxxxx) - ซ้าย
       - Cancel Qty TextField (กลาง) - ความกว้าง 100px
       - Item name/description (yyyyy) - ขวา
     - Line items มี border และ spacing ระหว่างกัน
     - Summary section ด้านล่าง:
       - "Tax selected: yyyyyyy" (ซ้าย)
       - "Total selected: yyyyyyy" (กลาง-ขวา)
       - Submit button (ขวาสุด)

**Tablet Layout (600px - 960px)**:
- RGA Info section: reason/subreason stack เป็นแนวตั้ง (1 column)
- Line items: ปรับ layout ให้พอดีกับหน้าจอ
- Summary section: อาจ wrap เป็น 2 บรรทัด

**Mobile Layout (< 600px)**:
- RGA Info section: ทุก field เป็น full width, stack แนวตั้ง
- Line items: แสดงเป็น Card แนวตั้ง
  - Item code และ name แสดงด้านบน
  - Cancel Qty TextField แสดงด้านล่าง (full width)
- Summary section: stack แนวตั้ง
  - Tax selected (full width)
  - Total selected (full width)
  - Submit button (full width)

**MUI Components**:
- Container (maxWidth="lg")
- Box/Paper (สำหรับ sections)
- Typography (สำหรับ headings และ labels)
- Select/Autocomplete (สำหรับ reason/subreason dropdowns)
- TextField (multiline สำหรับ remark, number สำหรับ cancel qty)
- Card/Box (สำหรับแต่ละ line item)
- Grid (สำหรับ responsive layout)
- Button (สำหรับ Submit)
- Divider (สำหรับแบ่ง sections)

### Responsive Breakpoints

ใช้ MUI breakpoints standard:
- xs: 0px - 600px (mobile)
- sm: 600px - 960px (tablet)
- md: 960px - 1280px (desktop)
- lg: 1280px+ (large desktop)

### Color และ Styling Guidelines

**Colors**:
- Primary: ใช้ MUI default primary color (blue)
- Error: ใช้ MUI error color (red) สำหรับ validation errors
- Background: white/light gray
- Borders: light gray (#e0e0e0)

**Spacing**:
- Section spacing: 32px (desktop), 24px (mobile)
- Field spacing: 16px
- Card/Box padding: 16px
- Button padding: 8px 24px

**Typography**:
- Headings: MUI Typography variant="h6"
- Labels: MUI Typography variant="body1"
- Input text: MUI default (14px)
- Helper text: MUI Typography variant="caption"

## คอมโพเนนต์และอินเทอร์เฟซ (Components and Interfaces)

### Recoil State Atoms

```javascript
// state/atoms.js
import { atom } from 'recoil';

// Atom สำหรับเก็บข้อมูลคำสั่งซื้อ
export const orderDataState = atom({
  key: 'orderDataState',
  default: null
});

// Atom สำหรับเก็บรายการเหตุผล RGA
export const rgaReasonsState = atom({
  key: 'rgaReasonsState',
  default: []
});

// Atom สำหรับเก็บเหตุผลหลักที่เลือก
export const selectedMainReasonState = atom({
  key: 'selectedMainReasonState',
  default: ''
});

// Atom สำหรับเก็บเหตุผลรองที่เลือก
export const selectedSubReasonState = atom({
  key: 'selectedSubReasonState',
  default: ''
});

// Atom สำหรับเก็บรายการสินค้าพร้อมจำนวนยกเลิก
export const lineItemsWithCancelQtyState = atom({
  key: 'lineItemsWithCancelQtyState',
  default: []
});
```

### 1. OrderSearch Component

**หน้าที่**: รับข้อมูลปีและหมายเลขคำสั่งซื้อจากผู้ใช้และค้นหาคำสั่งซื้อ

**Props**: 
```javascript
// OrderSearchProps
{
  onOrderFound: Function  // Callback function รับ orderData object
}
```

**Local State**:
```javascript
{
  orderYear: 0,           // number - ปีคำสั่งซื้อ (2 หลัก เช่น 24)
  orderNumber: 0,         // number - หมายเลขคำสั่งซื้อ
  loading: false,         // boolean - สถานะกำลังโหลด
  error: null            // string | null - ข้อความ error
}
```

**Recoil State Usage**:
- ใช้ `useSetRecoilState(orderDataState)` เพื่อบันทึกข้อมูลคำสั่งซื้อที่ค้นหาได้

**UI Elements**:
- TextField สำหรับปีคำสั่งซื้อ (required)
- TextField สำหรับหมายเลขคำสั่งซื้อ (required)
- Button สำหรับค้นหา
- Loading indicator
- Error message display

### 2. RGAForm Component

**หน้าที่**: แสดงฟอร์มสร้าง RGA พร้อมข้อมูลคำสั่งซื้อ

**Props**:
```javascript
// RGAFormProps
{
  onSuccess: Function  // Callback รับ rgaDocument object
}
```

**Recoil State Usage**:
- ใช้ `useRecoilValue(orderDataState)` เพื่ออ่านข้อมูลคำสั่งซื้อ
- ใช้ `useRecoilValue(selectedMainReasonState)` เพื่ออ่านเหตุผลหลัก
- ใช้ `useRecoilValue(selectedSubReasonState)` เพื่ออ่านเหตุผลรอง
- ใช้ `useRecoilValue(lineItemsWithCancelQtyState)` เพื่ออ่านรายการสินค้า

**Local State**:
```javascript
{
  loading: false,         // boolean - สถานะกำลังโหลด
  error: null            // string | null - ข้อความ error
}
```

### 3. OrderInfo Component

**หน้าที่**: แสดงข้อมูลพื้นฐานของคำสั่งซื้อ

**Props**: ไม่มี (อ่านจาก Recoil state)

**Recoil State Usage**:
- ใช้ `useRecoilValue(orderDataState)` เพื่ออ่านข้อมูลคำสั่งซื้อ

**UI Elements**:
- แสดงปีคำสั่งซื้อ
- แสดงหมายเลขคำสั่งซื้อ
- แสดงข้อมูลเพิ่มเติม (วันที่, ลูกค้า, ฯลฯ)

### 4. ReasonSelector Component

**หน้าที่**: ให้ผู้ใช้เลือกเหตุผลหลักและเหตุผลรอง

**Props**: ไม่มี (ใช้ Recoil state)

**Recoil State Usage**:
- ใช้ `useRecoilValue(rgaReasonsState)` เพื่ออ่านรายการเหตุผล
- ใช้ `useRecoilState(selectedMainReasonState)` เพื่ออ่านและเขียนเหตุผลหลัก
- ใช้ `useRecoilState(selectedSubReasonState)` เพื่ออ่านและเขียนเหตุผลรอง

**UI Elements**:
- Select/Autocomplete สำหรับ Main Reason (required)
- Select/Autocomplete สำหรับ Sub Reason (required, filtered by main reason)

### 5. LineItemsTable Component

**หน้าที่**: แสดงรายการสินค้าและให้กรอกจำนวนที่ต้องการยกเลิก

**Props**: ไม่มี (ใช้ Recoil state)

**Recoil State Usage**:
- ใช้ `useRecoilState(lineItemsWithCancelQtyState)` เพื่ออ่านและอัปเดตรายการสินค้า

**UI Elements**:
- Table/DataGrid แสดงรายการสินค้า
- Columns: รหัสสินค้า, ชื่อสินค้า, จำนวนเดิม, จำนวนที่ยกเลิก (input)
- TextField สำหรับกรอกจำนวนยกเลิก (with validation)

## โมเดลข้อมูล (Data Models)

### Order

```javascript
// Order object structure
{
  orderYear: 0,         // number - ปี พ.ศ. 2 หลัก (เช่น 24 สำหรับ 2567)
  orderNumber: 0,       // number - หมายเลขคำสั่งซื้อ
  orderDate: '',        // string (optional)
  customerName: '',     // string (optional)
  lineItems: []         // array of LineItem
}
```

### LineItem

```javascript
// LineItem object structure
{
  itemId: '',           // string
  itemCode: '',         // string
  itemName: '',         // string
  quantity: 0,          // number
  unitPrice: 0          // number (optional)
}
```

### LineItemWithCancelQty

```javascript
// LineItemWithCancelQty extends LineItem
{
  itemId: '',           // string
  itemCode: '',         // string
  itemName: '',         // string
  quantity: 0,          // number
  unitPrice: 0,         // number (optional)
  cancelQty: 0          // number - จำนวนที่ต้องการยกเลิก
}
```

### RGAReason

```javascript
// RGAReason object structure
{
  mainReasonId: '',     // string
  mainReasonName: '',   // string
  subReasons: []        // array of SubReason
}
```

### SubReason

```javascript
// SubReason object structure
{
  subReasonId: '',      // string
  subReasonName: ''     // string
}
```

### RGASubmitRequest

```javascript
// RGASubmitRequest object structure
{
  orderYear: 0,         // number - ปี พ.ศ. 2 หลัก
  orderNumber: 0,       // number - หมายเลขคำสั่งซื้อ
  mainReasonId: '',     // string
  subReasonId: '',      // string
  lineItems: [          // array
    {
      itemId: '',       // string
      cancelQty: 0      // number
    }
  ]
}
```

### RGADocument

```javascript
// RGADocument object structure
{
  rgaNumber: '',        // string
  orderYear: 0,         // number - ปี พ.ศ. 2 หลัก
  orderNumber: 0,       // number - หมายเลขคำสั่งซื้อ
  createdDate: '',      // string
  status: ''            // string
}
```

**หมายเหตุ**: สำหรับการตรวจสอบ type ใน runtime สามารถใช้ PropTypes ได้ตามความเหมาะสม

## API Service Layer

### API Configuration

```javascript
// config/apiConfig.js
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  endpoints: {
    order: '/order',
    rgaReason: '/rgaReason',
    rgaSubmit: '/rgaSubmit'
  }
};

export default API_CONFIG;
```

### API Service Functions

```javascript
// services/api.js
import API_CONFIG from '../config/apiConfig';

/**
 * ค้นหาคำสั่งซื้อจากปีและหมายเลข
 * @param {number} orderYear - ปีคำสั่งซื้อ (2 หลัก)
 * @param {number} orderNumber - หมายเลขคำสั่งซื้อ
 * @returns {Promise<Object>} Order object
 */
export async function fetchOrder(orderYear, orderNumber) {
  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.order}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderYear, orderNumber })
  });
  
  if (!response.ok) {
    throw new Error('ไม่พบคำสั่งซื้อ');
  }
  
  return response.json();
}

/**
 * ดึงรายการเหตุผล RGA ทั้งหมด
 * @returns {Promise<Array>} Array of RGAReason objects
 */
export async function fetchRGAReasons() {
  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.rgaReason}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลเหตุผลได้');
  }
  
  return response.json();
}

/**
 * ส่งข้อมูลสร้าง RGA
 * @param {Object} request - RGASubmitRequest object
 * @returns {Promise<Object>} RGADocument object
 */
export async function submitRGA(request) {
  const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.rgaSubmit}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error('ไม่สามารถสร้าง RGA ได้');
  }
  
  return response.json();
}
```

## Validation Utilities

```javascript
// utils/validation.js

/**
 * ตรวจสอบความถูกต้องของข้อมูลการค้นหาคำสั่งซื้อ
 * @param {number} orderYear - ปีคำสั่งซื้อ (2 หลัก)
 * @param {number} orderNumber - หมายเลขคำสั่งซื้อ
 * @returns {string|null} ข้อความ error หรือ null ถ้าถูกต้อง
 */
export function validateOrderSearch(orderYear, orderNumber) {
  if (!orderYear || orderYear === 0) {
    return 'กรุณากรอกปีคำสั่งซื้อ';
  }
  
  if (!orderNumber || orderNumber === 0) {
    return 'กรุณากรอกหมายเลขคำสั่งซื้อ';
  }
  
  if (!Number.isInteger(orderYear) || orderYear < 0 || orderYear > 99) {
    return 'ปีคำสั่งซื้อต้องเป็นตัวเลข 2 หลัก (0-99)';
  }
  
  if (!Number.isInteger(orderNumber) || orderNumber < 0) {
    return 'หมายเลขคำสั่งซื้อต้องเป็นตัวเลขที่มากกว่า 0';
  }
  
  return null;
}

/**
 * ตรวจสอบความถูกต้องของฟอร์ม RGA
 * @param {string} mainReason - เหตุผลหลัก
 * @param {string} subReason - เหตุผลรอง
 * @param {Array} lineItems - รายการสินค้า
 * @returns {string|null} ข้อความ error หรือ null ถ้าถูกต้อง
 */
export function validateRGAForm(mainReason, subReason, lineItems) {
  if (!mainReason) {
    return 'กรุณาเลือกเหตุผลหลัก';
  }
  
  if (!subReason) {
    return 'กรุณาเลือกเหตุผลรอง';
  }
  
  const hasAnyCancelQty = lineItems.some(item => item.cancelQty > 0);
  if (!hasAnyCancelQty) {
    return 'กรุณาระบุจำนวนสินค้าที่ต้องการยกเลิกอย่างน้อย 1 รายการ';
  }
  
  return null;
}

/**
 * ตรวจสอบความถูกต้องของจำนวนยกเลิก
 * @param {number} cancelQty - จำนวนที่ต้องการยกเลิก
 * @param {number} originalQty - จำนวนเดิม
 * @returns {string|null} ข้อความ error หรือ null ถ้าถูกต้อง
 */
export function validateCancelQty(cancelQty, originalQty) {
  if (cancelQty < 0) {
    return 'จำนวนต้องไม่ติดลบ';
  }
  
  if (!Number.isInteger(cancelQty)) {
    return 'จำนวนต้องเป็นจำนวนเต็ม';
  }
  
  if (cancelQty > originalQty) {
    return `จำนวนต้องไม่เกิน ${originalQty}`;
  }
  
  return null;
}
```

## Recoil Setup และ Configuration

### การติดตั้ง Recoil

```bash
npm install recoil
```

### การตั้งค่า Recoil Root

```javascript
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
```

### ตัวอย่างการใช้ Recoil ใน Component

```javascript
// components/OrderSearch.jsx
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { orderDataState, lineItemsWithCancelQtyState } from '../state/atoms';
import { fetchOrder } from '../services/api';
import { validateOrderSearch } from '../utils/validation';

function OrderSearch({ onOrderFound }) {
  const [orderYear, setOrderYear] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ใช้ Recoil เพื่อบันทึกข้อมูลคำสั่งซื้อ
  const setOrderData = useSetRecoilState(orderDataState);
  const setLineItems = useSetRecoilState(lineItemsWithCancelQtyState);

  const handleSearch = async () => {
    const validationError = validateOrderSearch(orderYear, orderNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrder(orderYear, orderNumber);
      
      // บันทึกข้อมูลลง Recoil state
      setOrderData(data);
      
      // แปลง lineItems เป็น lineItemsWithCancelQty
      const itemsWithCancelQty = data.lineItems.map(item => ({
        ...item,
        cancelQty: 0
      }));
      setLineItems(itemsWithCancelQty);
      
      onOrderFound(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX here...
  );
}

export default OrderSearch;
```

```javascript
// components/ReasonSelector.jsx
import { useRecoilState, useRecoilValue } from 'recoil';
import { 
  rgaReasonsState, 
  selectedMainReasonState, 
  selectedSubReasonState 
} from '../state/atoms';

function ReasonSelector() {
  const reasons = useRecoilValue(rgaReasonsState);
  const [mainReason, setMainReason] = useRecoilState(selectedMainReasonState);
  const [subReason, setSubReason] = useRecoilState(selectedSubReasonState);

  // Filter sub reasons based on selected main reason
  const selectedReasonData = reasons.find(r => r.mainReasonId === mainReason);
  const subReasons = selectedReasonData?.subReasons || [];

  const handleMainReasonChange = (value) => {
    setMainReason(value);
    setSubReason(''); // Reset sub reason when main reason changes
  };

  return (
    // JSX here...
  );
}

export default ReasonSelector;
```

```javascript
// components/LineItemsTable.jsx
import { useRecoilState } from 'recoil';
import { lineItemsWithCancelQtyState } from '../state/atoms';
import { validateCancelQty } from '../utils/validation';

function LineItemsTable() {
  const [lineItems, setLineItems] = useRecoilState(lineItemsWithCancelQtyState);

  const handleCancelQtyChange = (itemId, newQty) => {
    setLineItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId
          ? { ...item, cancelQty: newQty }
          : item
      )
    );
  };

  return (
    // JSX here...
  );
}

export default LineItemsTable;
```

## Mock API Setup

### JSON Server Configuration

```json
// mock-api/db.json
{
  "orders": [
    {
      "orderYear": 24,
      "orderNumber": 145,
      "orderDate": "2024-01-15",
      "customerName": "บริษัท ABC จำกัด",
      "lineItems": [
        {
          "itemId": "1",
          "itemCode": "ITEM001",
          "itemName": "สินค้า A",
          "quantity": 10,
          "unitPrice": 100
        },
        {
          "itemId": "2",
          "itemCode": "ITEM002",
          "itemName": "สินค้า B",
          "quantity": 5,
          "unitPrice": 200
        }
      ]
    }
  ],
  "rgaReasons": [
    {
      "mainReasonId": "M1",
      "mainReasonName": "สินค้าชำรุด",
      "subReasons": [
        {
          "subReasonId": "S1-1",
          "subReasonName": "แตกหัก"
        },
        {
          "subReasonId": "S1-2",
          "subReasonName": "เสียหาย"
        }
      ]
    },
    {
      "mainReasonId": "M2",
      "mainReasonName": "สั่งผิด",
      "subReasons": [
        {
          "subReasonId": "S2-1",
          "subReasonName": "สั่งผิดรุ่น"
        },
        {
          "subReasonId": "S2-2",
          "subReasonName": "สั่งผิดจำนวน"
        }
      ]
    }
  ],
  "rgaDocuments": []
}
```

### Custom Routes for JSON Server

```json
// mock-api/routes.json
{
  "/order": "/orders?orderYear=:orderYear&orderNumber=:orderNumber",
  "/rgaReason": "/rgaReasons",
  "/rgaSubmit": "/rgaDocuments"
}
```

### JSON Server Middleware

เนื่องจาก JSON Server ไม่รองรับ POST method โดยตรงสำหรับ query, จำเป็นต้องสร้าง custom middleware:

```javascript
// mock-api/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom POST /order endpoint
server.post('/order', (req, res) => {
  const { orderYear, orderNumber } = req.body;
  const db = router.db;
  const order = db.get('orders')
    .find({ orderYear, orderNumber })
    .value();
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Custom POST /rgaReason endpoint
server.post('/rgaReason', (req, res) => {
  const db = router.db;
  const reasons = db.get('rgaReasons').value();
  res.json(reasons);
});

// Custom POST /rgaSubmit endpoint
server.post('/rgaSubmit', (req, res) => {
  const db = router.db;
  const rgaNumber = `RGA${Date.now()}`;
  const rgaDocument = {
    rgaNumber,
    ...req.body,
    createdDate: new Date().toISOString(),
    status: 'pending'
  };
  
  db.get('rgaDocuments').push(rgaDocument).write();
  res.json(rgaDocument);
});

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
```


## Correctness Properties

Property คือลักษณะหรือพฤติกรรมที่ควรเป็นจริงในทุกการทำงานของระบบ - เป็นข้อความที่เป็นทางการเกี่ยวกับสิ่งที่ระบบควรทำ Properties ทำหน้าที่เป็นสะพานเชื่อมระหว่าง specifications ที่มนุษย์อ่านได้กับการรับประกันความถูกต้องที่เครื่องจักรตรวจสอบได้

### Property 1: Incomplete Order Search Validation

*สำหรับ* ข้อมูลการค้นหาคำสั่งซื้อใดๆ ที่ไม่ครบถ้วน (ปีหรือหมายเลขคำสั่งซื้อว่างเปล่า) ระบบควรแสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล

**Validates: Requirements 1.2**

### Property 2: Valid Order Search API Call

*สำหรับ* ข้อมูลการค้นหาคำสั่งซื้อใดๆ ที่ถูกต้องครบถ้วน เมื่อกดปุ่มค้นหา ระบบควรเรียก API `/order` พร้อมส่งปีและหมายเลขคำสั่งซื้อที่กรอก

**Validates: Requirements 1.3**

### Property 3: Successful Order Navigation

*สำหรับ* response ใดๆ จาก API `/order` ที่สำเร็จ ระบบควรนำทางไปยังหน้าสร้าง RGA และแสดงข้อมูลคำสั่งซื้อที่ได้รับ

**Validates: Requirements 1.4**

### Property 4: Order Search Error Handling

*สำหรับ* error response ใดๆ จาก API `/order` ระบบควรแสดงข้อความแจ้งข้อผิดพลาดและคงอยู่ที่หน้าค้นหา (ไม่ navigate)

**Validates: Requirements 1.5**

### Property 5: Order Search Loading State

*สำหรับ* การเรียก API `/order` ใดๆ ระหว่างที่กำลังเรียก API ระบบควรแสดงสถานะกำลังโหลด

**Validates: Requirements 1.6**

### Property 6: Main Reason Dropdown Display

*สำหรับ* response ใดๆ จาก API `/rgaReason` ที่มีข้อมูล Main_Reason ระบบควรแสดง dropdown ที่มี Main_Reason ทั้งหมดจาก response

**Validates: Requirements 2.2**

### Property 7: Sub Reason Filtering

*สำหรับ* Main_Reason ใดๆ ที่ผู้ใช้เลือก ระบบควรแสดง dropdown ของ Sub_Reason ที่มีเฉพาะ Sub_Reason ที่เกี่ยวข้องกับ Main_Reason นั้น

**Validates: Requirements 2.3**

### Property 8: Main Reason Change Resets Sub Reason

*สำหรับ* การเปลี่ยน Main_Reason ใดๆ ระบบควรล้างค่า Sub_Reason ที่เลือกไว้และอัพเดต dropdown ของ Sub_Reason

**Validates: Requirements 2.4**

### Property 9: Reason Selection Validation

*สำหรับ* การส่งฟอร์มใดๆ ที่ไม่ได้เลือก Main_Reason หรือ Sub_Reason ระบบควรแสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล

**Validates: Requirements 2.5**

### Property 10: Line Items Table Display

*สำหรับ* ข้อมูลคำสั่งซื้อใดๆ ที่มี Line_Item ระบบควรแสดงตารางที่มีรายการสินค้าทั้งหมดพร้อมจำนวนเดิม

**Validates: Requirements 3.1**

### Property 11: Cancel Quantity Input for All Items

*สำหรับ* Line_Item ทุกรายการในตาราง ระบบควรแสดงช่องกรอก Cancel_Quantity สำหรับแต่ละรายการ

**Validates: Requirements 3.2**

### Property 12: Cancel Quantity Exceeds Original Validation

*สำหรับ* Cancel_Quantity ใดๆ ที่มากกว่าจำนวนเดิม ระบบควรแสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล

**Validates: Requirements 3.3**

### Property 13: Invalid Cancel Quantity Validation

*สำหรับ* Cancel_Quantity ใดๆ ที่เป็นค่าลบหรือไม่ใช่ตัวเลข ระบบควรแสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล

**Validates: Requirements 3.4**

### Property 14: Valid Cancel Quantity Submission

*สำหรับ* ฟอร์มใดๆ ที่มี Cancel_Quantity ที่ถูกต้องอย่างน้อยหนึ่งรายการ ระบบควรอนุญาตให้ส่งข้อมูล

**Validates: Requirements 3.6**

### Property 15: RGA Submit API Call

*สำหรับ* ฟอร์มใดๆ ที่กรอกข้อมูลครบถ้วนและถูกต้อง เมื่อกดปุ่มส่ง ระบบควรเรียก API `/rgaSubmit` พร้อมข้อมูลคำสั่งซื้อ เหตุผล และรายการสินค้าที่ยกเลิก

**Validates: Requirements 4.1**

### Property 16: RGA Submit Loading State

*สำหรับ* การเรียก API `/rgaSubmit` ใดๆ ระหว่างที่กำลังเรียก API ระบบควรแสดงสถานะกำลังโหลดและปิดการใช้งานปุ่มส่ง

**Validates: Requirements 4.2**

### Property 17: RGA Submit Success Handling

*สำหรับ* response ใดๆ จาก API `/rgaSubmit` ที่สำเร็จและมี RGA_Document พร้อมหมายเลขอ้างอิง ระบบควรแสดงข้อความยืนยันความสำเร็จพร้อมหมายเลข RGA

**Validates: Requirements 4.3**

### Property 18: RGA Submit Error Handling

*สำหรับ* error response ใดๆ จาก API `/rgaSubmit` ระบบควรแสดงข้อความแจ้งข้อผิดพลาดและเปิดการใช้งานปุ่มส่งอีกครั้ง

**Validates: Requirements 4.4**

### Property 19: Mock API Contract Compliance

*สำหรับ* Mock API endpoint ทุกตัว request และ response format ควรตรงกับ Real API ทุกประการ

**Validates: Requirements 5.5**

### Property 20: POST Method for All API Calls

*สำหรับ* API call ทุกครั้งในระบบ ระบบควรใช้ POST method

**Validates: Requirements 6.5**

### Property 21: RGA Number Format Validation

*สำหรับ* RGA_Number ทุกตัวที่สร้างขึ้น ควรมีรูปแบบ YYNNNNNNNN โดยมีความยาว 10 หลักเสมอ โดย YY เป็นปี พ.ศ. 2 หลักสุดท้าย และ NNNNNNNN เป็นหมายเลขลำดับ 8 หลักที่เติม 0 ข้างหน้า

**Validates: Requirements 7.1, 7.2, 7.3, 7.5**

### Property 22: Automatic RGA Number Generation

*สำหรับ* RGA_Document ทุกตัวที่สร้างขึ้น ระบบควรสร้าง RGA_Number โดยอัตโนมัติตามรูปแบบที่กำหนด

**Validates: Requirements 7.4**

## Error Handling

### API Error Handling

**Order Search Errors**:
- Network errors: แสดงข้อความ "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
- 404 Not Found: แสดงข้อความ "ไม่พบคำสั่งซื้อ"
- 500 Server Error: แสดงข้อความ "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
- Timeout: แสดงข้อความ "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง"

**RGA Reason Errors**:
- Network errors: แสดงข้อความ "ไม่สามารถโหลดข้อมูลเหตุผลได้"
- Empty response: แสดงข้อความ "ไม่พบข้อมูลเหตุผล"
- Invalid format: แสดงข้อความ "ข้อมูลเหตุผลไม่ถูกต้อง"

**RGA Submit Errors**:
- Network errors: แสดงข้อความ "ไม่สามารถส่งข้อมูลได้"
- Validation errors: แสดงข้อความจาก server
- 500 Server Error: แสดงข้อความ "ไม่สามารถสร้าง RGA ได้ กรุณาลองใหม่อีกครั้ง"

### Validation Error Handling

**Order Search Validation**:
- Empty order year: "กรุณากรอกปีคำสั่งซื้อ"
- Empty order number: "กรุณากรอกหมายเลขคำสั่งซื้อ"
- Invalid year format: "ปีคำสั่งซื้อต้องเป็นตัวเลข 4 หลัก"

**Reason Selection Validation**:
- No main reason: "กรุณาเลือกเหตุผลหลัก"
- No sub reason: "กรุณาเลือกเหตุผลรอง"

**Cancel Quantity Validation**:
- Negative value: "จำนวนต้องไม่ติดลบ"
- Non-integer: "จำนวนต้องเป็นจำนวนเต็ม"
- Exceeds original: "จำนวนต้องไม่เกิน {originalQty}"
- No items selected: "กรุณาระบุจำนวนสินค้าที่ต้องการยกเลิกอย่างน้อย 1 รายการ"

### Error Recovery

**Retry Mechanism**:
- ให้ผู้ใช้สามารถลองใหม่ได้ทันทีสำหรับ network errors
- ไม่ clear form data เมื่อเกิด error เพื่อให้ผู้ใช้ไม่ต้องกรอกใหม่

**State Management**:
- เก็บ error state แยกจาก data state
- Clear error เมื่อผู้ใช้แก้ไขข้อมูล
- Reset error เมื่อเริ่มการ submit ใหม่

**User Feedback**:
- ใช้ MUI Snackbar หรือ Alert component แสดง error messages
- ใช้สีแดงสำหรับ error messages
- แสดง error ใกล้กับ field ที่เกิด error (inline validation)

## Testing Strategy

### Dual Testing Approach

ระบบใช้การทดสอบแบบ dual approach ที่ผสมผสานระหว่าง:

1. **Unit Tests**: ทดสอบกรณีเฉพาะเจาะจง, edge cases และ error conditions
2. **Property-Based Tests**: ทดสอบ properties ที่ต้องเป็นจริงกับ input ทุกชุด

ทั้งสองแบบเสริมกันและจำเป็นสำหรับการทดสอบที่ครอบคลุม

### Unit Testing

**Focus Areas**:
- ตัวอย่างเฉพาะเจาะจงที่แสดงพฤติกรรมที่ถูกต้อง
- Integration points ระหว่าง components
- Edge cases และ error conditions
- UI interactions และ navigation

**Testing Library**: Jest + React Testing Library

**Example Unit Tests**:
```javascript
// ตัวอย่าง unit test สำหรับ OrderSearch component
describe('OrderSearch Component', () => {
  test('should display form with year and order number inputs on load', () => {
    // Test Requirements 1.1
  });
  
  test('should show error when submitting empty form', () => {
    // Test Requirements 1.2 - specific example
  });
  
  test('should navigate to RGA form on successful order search', () => {
    // Test Requirements 1.4 - specific example
  });
});
```

### Property-Based Testing

**Focus Areas**:
- Properties ที่ต้องเป็นจริงกับ input ทุกชุด
- Validation logic ที่ต้องทำงานกับข้อมูลแบบสุ่ม
- API contract compliance
- Data transformation และ state management

**Testing Library**: fast-check (JavaScript property-based testing library)

**Configuration**:
- จำนวน iterations ขั้นต่ำ: 100 ครั้งต่อ property test
- แต่ละ property test ต้องอ้างอิงถึง property ในเอกสาร design
- Tag format: `Feature: rga-web-application, Property {number}: {property_text}`

**Example Property Tests**:
```javascript
// ตัวอย่าง property test สำหรับ validation
import fc from 'fast-check';

describe('Property Tests - Order Search Validation', () => {
  test('Property 1: Incomplete Order Search Validation', () => {
    // Feature: rga-web-application, Property 1: Incomplete Order Search Validation
    fc.assert(
      fc.property(
        fc.record({
          orderYear: fc.oneof(fc.constant(0), fc.integer()),
          orderNumber: fc.oneof(fc.constant(0), fc.integer())
        }).filter(data => data.orderYear === 0 || data.orderNumber === 0),
        (incompleteData) => {
          const error = validateOrderSearch(
            incompleteData.orderYear,
            incompleteData.orderNumber
          );
          return error !== null; // ต้องมี error เสมอ
        }
      ),
      { numRuns: 100 }
    );
  });
  
  test('Property 12: Cancel Quantity Exceeds Original Validation', () => {
    // Feature: rga-web-application, Property 12: Cancel Quantity Exceeds Original Validation
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        (originalQty, excess) => {
          const cancelQty = originalQty + excess;
          const error = validateCancelQty(cancelQty, originalQty);
          return error !== null; // ต้องมี error เสมอ
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Focus Areas**:
- การทำงานร่วมกันระหว่าง components
- API integration กับ Mock API
- State management ด้วย Recoil
- Navigation flow ระหว่างหน้า

**Testing Approach**:
- ใช้ React Testing Library สำหรับ integration tests
- Mock API calls ด้วย MSW (Mock Service Worker)
- Test complete user flows (search → select reasons → submit)

### Test Coverage Goals

**Minimum Coverage**:
- Unit tests: 80% code coverage
- Property tests: ครอบคลุม properties ทั้งหมดในเอกสาร design
- Integration tests: ครอบคลุม user flows หลักทั้งหมด

**Priority**:
1. Validation logic (highest priority)
2. API integration
3. State management
4. UI interactions
5. Error handling

### Testing Tools และ Libraries

**Required Dependencies**:
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "fast-check": "^3.0.0",
    "msw": "^2.0.0"
  }
}
```

**Test Scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```
