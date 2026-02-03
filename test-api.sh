#!/bin/bash

# Script สำหรับทดสอบ Mock API ทุก endpoint
# ใช้งาน: bash test-api.sh

API_URL="http://localhost:4001"

echo "=========================================="
echo "Testing RGA Mock API"
echo "=========================================="
echo ""

# Test 1: POST /order - ค้นหาคำสั่งซื้อที่มีอยู่
echo "1. Testing POST /order (Success Case)"
echo "   Request: orderYear=24, orderNumber=145"
curl -X POST "${API_URL}/order" \
  -H "Content-Type: application/json" \
  -d '{"orderYear": 24, "orderNumber": 145}' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 2: POST /order - ค้นหาคำสั่งซื้อที่ไม่มี
echo "2. Testing POST /order (Not Found Case)"
echo "   Request: orderYear=99, orderNumber=999"
curl -X POST "${API_URL}/order" \
  -H "Content-Type: application/json" \
  -d '{"orderYear": 99, "orderNumber": 999}' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 3: POST /order - ข้อมูลไม่ครบ
echo "3. Testing POST /order (Missing Data)"
echo "   Request: orderYear=24 (no orderNumber)"
curl -X POST "${API_URL}/order" \
  -H "Content-Type: application/json" \
  -d '{"orderYear": 24}' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 4: POST /rgaReason - ดึงรายการเหตุผล RGA
echo "4. Testing POST /rgaReason"
curl -X POST "${API_URL}/rgaReason" \
  -H "Content-Type: application/json" \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 5: POST /rgaSubmit - สร้าง RGA document
echo "5. Testing POST /rgaSubmit (Success Case)"
echo "   Request: Complete RGA submission"
curl -X POST "${API_URL}/rgaSubmit" \
  -H "Content-Type: application/json" \
  -d '{
    "orderYear": 24,
    "orderNumber": 145,
    "mainReasonId": "M1",
    "subReasonId": "S1-1",
    "remark": "สินค้าชำรุด แตกหัก",
    "lineItems": [
      {
        "itemId": "1",
        "cancelQty": 5
      },
      {
        "itemId": "2",
        "cancelQty": 3
      }
    ]
  }' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 6: POST /rgaSubmit - ข้อมูลไม่ครบ (ไม่มี mainReasonId)
echo "6. Testing POST /rgaSubmit (Missing Reason)"
echo "   Request: No mainReasonId"
curl -X POST "${API_URL}/rgaSubmit" \
  -H "Content-Type: application/json" \
  -d '{
    "orderYear": 24,
    "orderNumber": 145,
    "subReasonId": "S1-1",
    "lineItems": [
      {
        "itemId": "1",
        "cancelQty": 5
      }
    ]
  }' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 7: POST /rgaSubmit - ไม่มี lineItems
echo "7. Testing POST /rgaSubmit (No Line Items)"
echo "   Request: Empty lineItems"
curl -X POST "${API_URL}/rgaSubmit" \
  -H "Content-Type: application/json" \
  -d '{
    "orderYear": 24,
    "orderNumber": 145,
    "mainReasonId": "M1",
    "subReasonId": "S1-1",
    "lineItems": []
  }' \
  -w "\n\n"

echo "=========================================="
echo ""

# Test 8: POST /rgaSubmit - lineItems ไม่มี cancelQty > 0
echo "8. Testing POST /rgaSubmit (No Valid Cancel Qty)"
echo "   Request: All cancelQty = 0"
curl -X POST "${API_URL}/rgaSubmit" \
  -H "Content-Type: application/json" \
  -d '{
    "orderYear": 24,
    "orderNumber": 145,
    "mainReasonId": "M1",
    "subReasonId": "S1-1",
    "lineItems": [
      {
        "itemId": "1",
        "cancelQty": 0
      }
    ]
  }' \
  -w "\n\n"

echo "=========================================="
echo ""
echo "All tests completed!"
echo "=========================================="
