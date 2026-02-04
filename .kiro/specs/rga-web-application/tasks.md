# แผนการพัฒนา: RGA Web Application

## ภาพรวม

แอปพลิเคชัน RGA Web Application เป็น Single Page Application ที่พัฒนาด้วย React + Vite, MUI, และ Recoil โดยมีการใช้ JSON Server เป็น Mock API สำหรับการพัฒนา แผนการพัฒนานี้เริ่มต้นด้วยการตั้งค่า Mock API ก่อนเป็นอันดับแรก เพื่อให้สามารถทดสอบการทำงานของ Frontend ได้ทันที

## Tasks

- [ ] 1. ตั้งค่า Mock API ด้วย JSON Server (PRIORITY)
  - [x] 1.1 ติดตั้ง JSON Server และสร้างโครงสร้างไฟล์
    - ติดตั้ง json-server เป็น dev dependency
    - สร้างโฟลเดอร์ `mock-api/`
    - สร้างไฟล์ `mock-api/db.json` พร้อมข้อมูล orders, rgaReasons, และ rgaDocuments
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 1.2 สร้าง custom server สำหรับ JSON Server
    - สร้างไฟล์ `mock-api/server.js`
    - เขียน middleware สำหรับ POST `/order` endpoint (รับ orderYear และ orderNumber, ค้นหาและส่งข้อมูลคำสั่งซื้อกลับ)
    - เขียน middleware สำหรับ POST `/rgaReason` endpoint (ส่งรายการเหตุผล RGA ทั้งหมด)
    - เขียน middleware สำหรับ POST `/rgaSubmit` endpoint (สร้าง RGA document พร้อมหมายเลข RGA และบันทึกลง database)
    - _Requirements: 5.2, 5.3, 5.4, 6.5_

  - [x] 1.3 เพิ่ม script สำหรับรัน Mock API
    - เพิ่ม script `"mock-api": "node mock-api/server.js"` ใน package.json
    - ทดสอบรัน Mock API บน port 3001
    - ทดสอบเรียก endpoints ทั้ง 3 ตัวด้วย Postman หรือ curl
    - _Requirements: 5.1_


  - [ ]* 1.4 เขียน property test สำหรับ Mock API contract compliance
    - **Property 19: Mock API Contract Compliance**
    - **Validates: Requirements 5.5**
    - ทดสอบว่า request/response format ของ Mock API ตรงกับ Real API
    - ใช้ fast-check สร้างข้อมูล request แบบสุ่มและตรวจสอบ response format

- [ ] 2. ตั้งค่าโปรเจค React + Vite และติดตั้ง dependencies
  - [-] 2.1 สร้างโปรเจค React ด้วย Vite
    - รัน `npm create vite@latest rga-web-application -- --template react`
    - ติดตั้ง dependencies พื้นฐาน
    - ตั้งค่า Vite config สำหรับ development
    - _Requirements: 6.1, 6.2_

  - [x] 2.2 ติดตั้ง MUI และ Recoil
    - ติดตั้ง @mui/material, @emotion/react, @emotion/styled
    - ติดตั้ง recoil
    - ติดตั้ง react-router-dom สำหรับ navigation
    - _Requirements: 6.3_

  - [~] 2.3 ติดตั้ง testing libraries
    - ติดตั้ง vitest, @testing-library/react, @testing-library/jest-dom
    - ติดตั้ง @testing-library/user-event
    - ติดตั้ง fast-check สำหรับ property-based testing
    - ติดตั้ง msw (Mock Service Worker) สำหรับ mock API ใน tests
    - ตั้งค่า vitest.config.js
    - _Requirements: Testing Strategy_

  - [~] 2.4 สร้างโครงสร้างโฟลเดอร์
    - สร้างโฟลเดอร์ `src/components/`, `src/services/`, `src/hooks/`, `src/utils/`, `src/config/`, `src/state/`
    - สร้างโฟลเดอร์ `src/__tests__/` สำหรับ test files
    - _Requirements: Architecture_

- [ ] 3. ตั้งค่า Recoil และ API configuration
  - [~] 3.1 สร้าง Recoil atoms
    - สร้างไฟล์ `src/state/atoms.js`
    - เขียน atoms: orderDataState, rgaReasonsState, selectedMainReasonState, selectedSubReasonState, lineItemsWithCancelQtyState
    - _Requirements: State Management_

  - [~] 3.2 ตั้งค่า RecoilRoot ใน main.jsx
    - แก้ไขไฟล์ `src/main.jsx`
    - Wrap App component ด้วย RecoilRoot
    - _Requirements: State Management_

  - [~] 3.3 สร้าง API configuration
    - สร้างไฟล์ `src/config/apiConfig.js`
    - กำหนด baseURL และ endpoints
    - รองรับการเปลี่ยน baseURL ผ่าน environment variable (VITE_API_BASE_URL)
    - _Requirements: 5.6_

  - [~] 3.4 สร้าง API service layer
    - สร้างไฟล์ `src/services/api.js`
    - เขียน functions: fetchOrder, fetchRGAReasons, submitRGA
    - ใช้ fetch API และ POST method สำหรับทุก endpoint
    - _Requirements: 6.5, API Service Layer_


  - [ ]* 3.5 เขียน property test สำหรับ POST method usage
    - **Property 20: POST Method for All API Calls**
    - **Validates: Requirements 6.5**
    - ทดสอบว่าทุก API call ใช้ POST method

- [ ] 4. สร้าง validation utilities
  - [~] 4.1 สร้างไฟล์ validation utilities
    - สร้างไฟล์ `src/utils/validation.js`
    - เขียน function validateOrderSearch (ตรวจสอบปีและหมายเลขคำสั่งซื้อ)
    - เขียน function validateRGAForm (ตรวจสอบเหตุผลและรายการสินค้า)
    - เขียน function validateCancelQty (ตรวจสอบจำนวนยกเลิก)
    - _Requirements: 1.2, 2.5, 3.3, 3.4, 3.5_

  - [ ]* 4.2 เขียน property test สำหรับ incomplete order search validation
    - **Property 1: Incomplete Order Search Validation**
    - **Validates: Requirements 1.2**
    - ทดสอบว่าข้อมูลไม่ครบถ้วนจะถูก reject เสมอ

  - [ ]* 4.3 เขียน property test สำหรับ cancel quantity validation
    - **Property 12: Cancel Quantity Exceeds Original Validation**
    - **Property 13: Invalid Cancel Quantity Validation**
    - **Validates: Requirements 3.3, 3.4**
    - ทดสอบว่าจำนวนที่เกินหรือไม่ถูกต้องจะถูก reject เสมอ

  - [ ]* 4.4 เขียน property test สำหรับ reason selection validation
    - **Property 9: Reason Selection Validation**
    - **Validates: Requirements 2.5**
    - ทดสอบว่าการไม่เลือกเหตุผลจะถูก reject เสมอ

- [ ] 5. สร้าง OrderSearch component
  - [~] 5.1 สร้าง OrderSearch component พื้นฐาน
    - สร้างไฟล์ `src/components/OrderSearch.jsx`
    - สร้าง UI ด้วย MUI components (Container, TextField, Button)
    - จัดการ local state (orderYear, orderNumber, loading, error)
    - ใช้ useSetRecoilState เพื่อบันทึกข้อมูลคำสั่งซื้อ
    - _Requirements: 1.1_

  - [~] 5.2 เพิ่ม validation และ API call
    - เรียกใช้ validateOrderSearch ก่อนส่งข้อมูล
    - เรียก fetchOrder API เมื่อ validation ผ่าน
    - จัดการ loading state และ error state
    - _Requirements: 1.2, 1.3, 1.6_

  - [~] 5.3 เพิ่ม navigation และ error handling
    - Navigate ไปหน้า RGA form เมื่อค้นหาสำเร็จ
    - แสดง error message เมื่อเกิด error
    - คงอยู่ที่หน้าค้นหาเมื่อเกิด error
    - _Requirements: 1.4, 1.5_

  - [~] 5.4 ทำ responsive design สำหรับ OrderSearch
    - ใช้ MUI Grid และ breakpoints
    - ปรับ layout สำหรับ desktop, tablet, mobile
    - ทดสอบบนหน้าจอขนาดต่างๆ
    - _Requirements: 8.1, 8.2, 8.3_


  - [ ]* 5.5 เขียน unit tests สำหรับ OrderSearch component
    - ทดสอบการแสดงฟอร์มเมื่อโหลดหน้า
    - ทดสอบการแสดง error เมื่อส่งฟอร์มว่าง
    - ทดสอบการ navigate เมื่อค้นหาสำเร็จ
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ]* 5.6 เขียน property tests สำหรับ OrderSearch behavior
    - **Property 2: Valid Order Search API Call**
    - **Property 3: Successful Order Navigation**
    - **Property 4: Order Search Error Handling**
    - **Property 5: Order Search Loading State**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [ ] 6. สร้าง ReasonSelector component
  - [~] 6.1 สร้าง ReasonSelector component พื้นฐาน
    - สร้างไฟล์ `src/components/ReasonSelector.jsx`
    - สร้าง UI ด้วย MUI Select/Autocomplete
    - ใช้ useRecoilValue เพื่ออ่าน rgaReasonsState
    - ใช้ useRecoilState เพื่อจัดการ selectedMainReasonState และ selectedSubReasonState
    - _Requirements: 2.2_

  - [~] 6.2 เพิ่ม logic สำหรับ filter sub reasons
    - Filter sub reasons ตาม main reason ที่เลือก
    - แสดง sub reason dropdown เฉพาะเมื่อเลือก main reason แล้ว
    - _Requirements: 2.3_

  - [~] 6.3 เพิ่ม logic สำหรับ reset sub reason
    - Reset sub reason เมื่อเปลี่ยน main reason
    - อัพเดต sub reason dropdown
    - _Requirements: 2.4_

  - [ ]* 6.4 เขียน unit tests สำหรับ ReasonSelector
    - ทดสอบการแสดง main reason dropdown
    - ทดสอบการ filter sub reasons
    - ทดสอบการ reset sub reason เมื่อเปลี่ยน main reason
    - _Requirements: 2.2, 2.3, 2.4_

  - [ ]* 6.5 เขียน property tests สำหรับ ReasonSelector behavior
    - **Property 6: Main Reason Dropdown Display**
    - **Property 7: Sub Reason Filtering**
    - **Property 8: Main Reason Change Resets Sub Reason**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [ ] 7. สร้าง LineItemsTable component
  - [~] 7.1 สร้าง LineItemsTable component พื้นฐาน
    - สร้างไฟล์ `src/components/LineItemsTable.jsx`
    - สร้าง UI แสดงรายการสินค้าเป็น Cards/Boxes (ไม่ใช่ table)
    - ใช้ useRecoilState เพื่อจัดการ lineItemsWithCancelQtyState
    - แสดงข้อมูล: item code, item name, original quantity
    - _Requirements: 3.1_

  - [~] 7.2 เพิ่ม cancel quantity input fields
    - เพิ่ม TextField สำหรับกรอก cancel quantity ในแต่ละรายการ
    - ใช้ type="number" สำหรับ TextField
    - _Requirements: 3.2_


  - [~] 7.3 เพิ่ม validation สำหรับ cancel quantity
    - เรียกใช้ validateCancelQty เมื่อผู้ใช้กรอกข้อมูล
    - แสดง error message ใต้ TextField เมื่อข้อมูลไม่ถูกต้อง
    - ป้องกันการกรอกค่าที่เกินจำนวนเดิม, ค่าลบ, หรือไม่ใช่ตัวเลข
    - _Requirements: 3.3, 3.4_

  - [~] 7.4 ทำ responsive design สำหรับ LineItemsTable
    - ใช้ MUI Grid และ breakpoints
    - ปรับ layout สำหรับ desktop (horizontal), mobile (vertical stack)
    - ทดสอบบนหน้าจอขนาดต่างๆ
    - _Requirements: 8.4, 8.6_

  - [ ]* 7.5 เขียน unit tests สำหรับ LineItemsTable
    - ทดสอบการแสดงรายการสินค้าทั้งหมด
    - ทดสอบการแสดง cancel quantity input
    - ทดสอบ validation errors
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 7.6 เขียน property tests สำหรับ LineItemsTable behavior
    - **Property 10: Line Items Table Display**
    - **Property 11: Cancel Quantity Input for All Items**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 8. สร้าง OrderInfo component
  - [~] 8.1 สร้าง OrderInfo component
    - สร้างไฟล์ `src/components/OrderInfo.jsx`
    - สร้าง UI แสดงข้อมูลคำสั่งซื้อ (order year, order number, customer name, order date)
    - ใช้ useRecoilValue เพื่ออ่าน orderDataState
    - ใช้ MUI Typography และ Box สำหรับ layout
    - _Requirements: Order Info Display_

  - [ ]* 8.2 เขียน unit tests สำหรับ OrderInfo
    - ทดสอบการแสดงข้อมูลคำสั่งซื้อ
    - ทดสอบการจัดการกรณีไม่มีข้อมูล

- [ ] 9. สร้าง RGAForm component
  - [~] 9.1 สร้าง RGAForm component พื้นฐาน
    - สร้างไฟล์ `src/components/RGAForm.jsx`
    - สร้าง layout หลักด้วย MUI Container
    - แบ่งเป็น 2 sections: RGA Info และ Order Detail
    - รวม OrderInfo, ReasonSelector, และ LineItemsTable components
    - _Requirements: RGA Form Layout_

  - [~] 9.2 เพิ่ม remark textarea
    - เพิ่ม TextField multiline สำหรับ remark
    - ตั้งค่า rows={4} สำหรับ textarea
    - _Requirements: RGA Form Layout_

  - [~] 9.3 เพิ่ม summary section
    - แสดง "Balance" และ "Return Qty" ด้านบน line items
    - แสดง "Tax selected" และ "Total selected" ด้านล่าง line items
    - คำนวณค่าจาก line items ที่เลือก
    - _Requirements: RGA Form Layout_

  - [~] 9.4 เพิ่ม submit button และ validation
    - เพิ่ม Submit button
    - เรียกใช้ validateRGAForm ก่อนส่งข้อมูล
    - แสดง error message เมื่อ validation ไม่ผ่าน
    - _Requirements: 2.5, 3.5, 3.6_


  - [~] 9.5 เพิ่ม API call สำหรับ submit RGA
    - เรียก submitRGA API เมื่อ validation ผ่าน
    - จัดการ loading state (แสดง loading indicator และปิดการใช้งานปุ่ม)
    - แสดงข้อความสำเร็จพร้อมหมายเลข RGA เมื่อสำเร็จ
    - แสดง error message และเปิดปุ่มอีกครั้งเมื่อเกิด error
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [~] 9.6 ทำ responsive design สำหรับ RGAForm
    - ใช้ MUI Grid และ breakpoints
    - ปรับ layout สำหรับ desktop (2 columns), tablet/mobile (1 column)
    - ทดสอบบนหน้าจอขนาดต่างๆ
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 9.7 เขียน unit tests สำหรับ RGAForm
    - ทดสอบการแสดงฟอร์มครบถ้วน
    - ทดสอบ validation ก่อนส่งข้อมูล
    - ทดสอบการแสดงข้อความสำเร็จ
    - ทดสอบการแสดง error
    - _Requirements: 2.5, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 9.8 เขียน property tests สำหรับ RGAForm behavior
    - **Property 14: Valid Cancel Quantity Submission**
    - **Property 15: RGA Submit API Call**
    - **Property 16: RGA Submit Loading State**
    - **Property 17: RGA Submit Success Handling**
    - **Property 18: RGA Submit Error Handling**
    - **Validates: Requirements 3.6, 4.1, 4.2, 4.3, 4.4**

- [ ] 10. สร้าง custom hook สำหรับ RGA reasons
  - [~] 10.1 สร้าง useRGAReasons hook
    - สร้างไฟล์ `src/hooks/useRGAReasons.js`
    - เรียก fetchRGAReasons API เมื่อ component mount
    - บันทึกข้อมูลลง rgaReasonsState
    - จัดการ loading และ error states
    - _Requirements: 2.1_

  - [ ]* 10.2 เขียน unit tests สำหรับ useRGAReasons
    - ทดสอบการเรียก API เมื่อ mount
    - ทดสอบการบันทึกข้อมูลลง Recoil state
    - ทดสอบการจัดการ error
    - _Requirements: 2.1_

- [ ] 11. สร้าง App component และ routing
  - [~] 11.1 ตั้งค่า React Router
    - แก้ไขไฟล์ `src/App.jsx`
    - ตั้งค่า BrowserRouter และ Routes
    - สร้าง route สำหรับ "/" (OrderSearch) และ "/rga-form" (RGAForm)
    - _Requirements: Navigation_

  - [~] 11.2 เพิ่ม MUI ThemeProvider
    - สร้าง custom theme (ถ้าต้องการ) หรือใช้ default theme
    - Wrap App ด้วย ThemeProvider
    - _Requirements: 6.3_

  - [~] 11.3 ทดสอบ navigation flow
    - ทดสอบการ navigate จากหน้าค้นหาไปหน้า RGA form
    - ทดสอบการส่งข้อมูลผ่าน Recoil state
    - _Requirements: Navigation_


- [~] 12. Checkpoint - ทดสอบการทำงานพื้นฐาน
  - รัน Mock API และ Frontend พร้อมกัน
  - ทดสอบ flow ทั้งหมด: ค้นหาคำสั่งซื้อ → เลือกเหตุผล → กรอกจำนวนยกเลิก → ส่งฟอร์ม
  - ตรวจสอบว่า API calls ทำงานถูกต้อง
  - ตรวจสอบว่า validation ทำงานถูกต้อง
  - ตรวจสอบว่า responsive design ทำงานบนหน้าจอขนาดต่างๆ
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. เพิ่ม RGA number generation logic
  - [~] 13.1 สร้าง utility function สำหรับ generate RGA number
    - สร้างไฟล์ `src/utils/rgaNumber.js`
    - เขียน function generateRGANumber (รูปแบบ YYNNNNNNNN)
    - YY = ปี พ.ศ. 2 หลักสุดท้าย
    - NNNNNNNN = หมายเลขลำดับ 8 หลัก (เติม 0 ข้างหน้า)
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [~] 13.2 เพิ่ม logic ใน Mock API server
    - แก้ไข `mock-api/server.js`
    - ใช้ generateRGANumber เมื่อสร้าง RGA document
    - ตรวจสอบว่าหมายเลข RGA ถูกสร้างอัตโนมัติ
    - _Requirements: 7.4_

  - [ ]* 13.3 เขียน property tests สำหรับ RGA number format
    - **Property 21: RGA Number Format Validation**
    - **Property 22: Automatic RGA Number Generation**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
    - ทดสอบว่าหมายเลข RGA ที่สร้างขึ้นมีรูปแบบถูกต้องเสมอ

- [ ] 14. เพิ่ม error handling และ user feedback
  - [~] 14.1 เพิ่ม MUI Snackbar สำหรับแสดง notifications
    - สร้าง reusable Snackbar component
    - ใช้แสดง success/error messages
    - _Requirements: Error Handling_

  - [~] 14.2 ปรับปรุง error messages
    - เพิ่ม error messages ที่ชัดเจนสำหรับทุก error cases
    - แสดง error messages ใกล้กับ field ที่เกิด error (inline validation)
    - ใช้สีแดงสำหรับ error messages
    - _Requirements: Error Handling_

  - [~] 14.3 เพิ่ม retry mechanism
    - ให้ผู้ใช้สามารถลองใหม่ได้ทันทีสำหรับ network errors
    - ไม่ clear form data เมื่อเกิด error
    - _Requirements: Error Handling_

  - [ ]* 14.4 เขียน unit tests สำหรับ error handling
    - ทดสอบการแสดง error messages
    - ทดสอบ retry mechanism
    - ทดสอบ inline validation
    - _Requirements: Error Handling_

- [ ] 15. เพิ่ม loading states และ UI polish
  - [~] 15.1 เพิ่ม loading indicators
    - ใช้ MUI CircularProgress สำหรับ API calls
    - ใช้ MUI Skeleton สำหรับ loading placeholders (ถ้าต้องการ)
    - ปิดการใช้งานปุ่มระหว่าง loading
    - _Requirements: 1.6, 4.2_

  - [~] 15.2 ปรับปรุง UI styling
    - ปรับ spacing, padding, margins ให้สวยงาม
    - เพิ่ม hover effects สำหรับ buttons
    - ปรับ colors ตาม MUI theme
    - _Requirements: UI Layout Design_


  - [~] 15.3 ทดสอบ accessibility
    - ตรวจสอบ keyboard navigation
    - ตรวจสอบ screen reader compatibility
    - ตรวจสอบ color contrast
    - _Requirements: 8.6_

- [ ] 16. เขียน integration tests
  - [ ]* 16.1 ตั้งค่า MSW (Mock Service Worker)
    - สร้างไฟล์ `src/__tests__/mocks/handlers.js`
    - สร้าง mock handlers สำหรับ API endpoints ทั้ง 3 ตัว
    - ตั้งค่า MSW server สำหรับ tests
    - _Requirements: Integration Testing_

  - [ ]* 16.2 เขียน integration tests สำหรับ complete user flow
    - ทดสอบ flow: ค้นหาคำสั่งซื้อ → แสดงฟอร์ม RGA → เลือกเหตุผล → กรอกจำนวน → ส่งฟอร์ม
    - ทดสอบ state management ด้วย Recoil
    - ทดสอบ navigation ระหว่างหน้า
    - _Requirements: Integration Testing_

  - [ ]* 16.3 เขียน integration tests สำหรับ error scenarios
    - ทดสอบ API errors
    - ทดสอบ validation errors
    - ทดสอบ network errors
    - _Requirements: Integration Testing_

- [ ] 17. เพิ่มเติม property-based tests ที่เหลือ
  - [ ]* 17.1 เขียน property tests สำหรับ data transformation
    - ทดสอบการแปลง lineItems เป็น lineItemsWithCancelQty
    - ทดสอบการ filter sub reasons ตาม main reason
    - _Requirements: State Management_

  - [ ]* 17.2 เขียน property tests สำหรับ API request/response
    - ทดสอบว่า API requests มี format ถูกต้อง
    - ทดสอบว่า API responses ถูก parse ถูกต้อง
    - _Requirements: API Service Layer_

- [ ] 18. สร้างเอกสารและ README
  - [~] 18.1 สร้าง README.md
    - เขียนคำอธิบายโปรเจค
    - เขียนวิธีการติดตั้งและรัน
    - เขียนวิธีการรัน tests
    - เขียนวิธีการเปลี่ยนจาก Mock API ไปใช้ Real API
    - _Requirements: Documentation_

  - [~] 18.2 เพิ่ม code comments
    - เพิ่ม JSDoc comments สำหรับ functions
    - เพิ่ม comments อธิบาย complex logic
    - _Requirements: Documentation_

- [~] 19. Final checkpoint - ทดสอบทั้งระบบ
  - รัน all tests (unit tests + property tests + integration tests)
  - ตรวจสอบ test coverage (เป้าหมาย 80%)
  - ทดสอบ responsive design บนอุปกรณ์จริง (desktop, tablet, mobile)
  - ทดสอบ complete user flows ทั้งหมด
  - ทดสอบ error scenarios ทั้งหมด
  - ทดสอบการเปลี่ยนจาก Mock API ไปใช้ Real API (เปลี่ยน VITE_API_BASE_URL)
  - Ensure all tests pass, ask the user if questions arise.

## หมายเหตุ

- Tasks ที่มีเครื่องหมาย `*` เป็น optional tasks (เช่น tests, documentation) ที่สามารถข้ามได้เพื่อให้ได้ MVP เร็วขึ้น
- แต่ละ task อ้างอิงถึง requirements เฉพาะเจาะจงเพื่อความชัดเจน
- Checkpoints ช่วยให้มั่นใจว่าระบบทำงานถูกต้องในแต่ละขั้นตอน
- Property tests ตรวจสอบความถูกต้องแบบ universal ด้วยข้อมูลสุ่ม
- Unit tests ตรวจสอบกรณีเฉพาะเจาะจงและ edge cases
- การพัฒนาเริ่มจาก Mock API ก่อนเพื่อให้สามารถทดสอบ Frontend ได้ทันที โดยไม่ต้องรอ Backend API
