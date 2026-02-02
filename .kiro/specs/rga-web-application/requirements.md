# เอกสารความต้องการ (Requirements Document)

## บทนำ (Introduction)

ระบบ RGA (Return Goods Authorization) เป็นแอปพลิเคชันเว็บส่วน Frontend สำหรับจัดการการยกเลิกและคืนสินค้า โดยทำงานร่วมกับ Backend API ที่ทีมพัฒนา API เตรียมไว้แล้ว ระบบนี้ช่วยให้ผู้ใช้สามารถค้นหาคำสั่งซื้อ เลือกเหตุผลในการยกเลิก และระบุรายการสินค้าที่ต้องการยกเลิก (ทั้งหมดหรือบางส่วน) ได้อย่างสะดวก

## อภิธานศัพท์ (Glossary)

- **RGA_System**: ระบบ RGA Frontend Application ที่พัฒนาด้วย React + Vite และ MUI
- **Order**: คำสั่งซื้อที่มีข้อมูลปีและหมายเลขคำสั่งซื้อ
- **Line_Item**: รายการสินค้าแต่ละรายการในคำสั่งซื้อ
- **Main_Reason**: เหตุผลหลักในการยกเลิกสินค้า
- **Sub_Reason**: เหตุผลรองที่ขึ้นอยู่กับเหตุผลหลัก
- **Cancel_Quantity**: จำนวนสินค้าที่ต้องการยกเลิก
- **RGA_Document**: เอกสาร RGA ที่สร้างขึ้นพร้อมหมายเลขอ้างอิง
- **Mock_API**: API จำลองที่สร้างด้วย JSON Server สำหรับการพัฒนา
- **Real_API**: API จริงที่ทีม Backend พัฒนา
- **RGA_Number**: หมายเลขอ้างอิง RGA ในรูปแบบ YYNNNNNNNN (10 หลัก)
- **Responsive_Layout**: การออกแบบที่ปรับตัวให้เหมาะสมกับขนาดหน้าจอต่างๆ

## ความต้องการ (Requirements)

### Requirement 1: ค้นหาคำสั่งซื้อ

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการค้นหาคำสั่งซื้อด้วยปีและหมายเลขคำสั่งซื้อ เพื่อที่จะสามารถดูรายละเอียดและดำเนินการยกเลิกสินค้าได้

#### Acceptance Criteria

1. WHEN ผู้ใช้เข้าสู่หน้าค้นหาคำสั่งซื้อ THEN THE RGA_System SHALL แสดงฟอร์มที่มีช่องกรอกปีคำสั่งซื้อและหมายเลขคำสั่งซื้อ
2. WHEN ผู้ใช้กรอกข้อมูลไม่ครบถ้วนและกดปุ่มค้นหา THEN THE RGA_System SHALL แสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล
3. WHEN ผู้ใช้กรอกข้อมูลครบถ้วนและกดปุ่มค้นหา THEN THE RGA_System SHALL เรียก API `/order` พร้อมส่งปีและหมายเลขคำสั่งซื้อ
4. WHEN API `/order` ส่งข้อมูลคำสั่งซื้อกลับมา THEN THE RGA_System SHALL นำทางไปยังหน้าสร้าง RGA พร้อมแสดงข้อมูลคำสั่งซื้อ
5. WHEN API `/order` ส่งข้อผิดพลาดกลับมา THEN THE RGA_System SHALL แสดงข้อความแจ้งข้อผิดพลาดและคงอยู่ที่หน้าค้นหา
6. WHILE กำลังเรียก API THEN THE RGA_System SHALL แสดงสถานะกำลังโหลด

### Requirement 2: เลือกเหตุผลในการยกเลิก

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการเลือกเหตุผลในการยกเลิกสินค้าจากรายการที่กำหนดไว้ เพื่อระบุสาเหตุที่ชัดเจนในการยกเลิก

#### Acceptance Criteria

1. WHEN ผู้ใช้เข้าสู่หน้าสร้าง RGA THEN THE RGA_System SHALL เรียก API `/rgaReason` เพื่อดึงข้อมูล Main_Reason และ Sub_Reason
2. WHEN API `/rgaReason` ส่งข้อมูลกลับมา THEN THE RGA_System SHALL แสดง dropdown สำหรับเลือก Main_Reason
3. WHEN ผู้ใช้เลือก Main_Reason THEN THE RGA_System SHALL แสดง dropdown สำหรับเลือก Sub_Reason ที่เกี่ยวข้องกับ Main_Reason ที่เลือก
4. WHEN ผู้ใช้เปลี่ยน Main_Reason THEN THE RGA_System SHALL ล้างค่า Sub_Reason ที่เลือกไว้และอัพเดต dropdown ของ Sub_Reason
5. WHEN ผู้ใช้พยายามส่งฟอร์มโดยไม่ได้เลือก Main_Reason หรือ Sub_Reason THEN THE RGA_System SHALL แสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล

### Requirement 3: ยกเลิกสินค้าบางส่วน

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการยกเลิกเฉพาะบางรายการหรือบางจำนวนของสินค้าในคำสั่งซื้อ เพื่อความยืดหยุ่นในการจัดการคำสั่งซื้อ

#### Acceptance Criteria

1. WHEN หน้าสร้าง RGA แสดงข้อมูลคำสั่งซื้อ THEN THE RGA_System SHALL แสดงตารางรายการสินค้าทั้งหมดพร้อมจำนวนเดิม
2. FOR ALL Line_Item ในตาราง THE RGA_System SHALL แสดงช่องกรอก Cancel_Quantity
3. WHEN ผู้ใช้กรอก Cancel_Quantity ที่มากกว่าจำนวนเดิม THEN THE RGA_System SHALL แสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล
4. WHEN ผู้ใช้กรอก Cancel_Quantity ที่เป็นค่าลบหรือไม่ใช่ตัวเลข THEN THE RGA_System SHALL แสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล
5. WHEN ผู้ใช้ส่งฟอร์มโดยไม่ได้กรอก Cancel_Quantity ในรายการใดเลย THEN THE RGA_System SHALL แสดงข้อความแจ้งเตือนและป้องกันการส่งข้อมูล
6. WHEN ผู้ใช้กรอก Cancel_Quantity ที่ถูกต้องอย่างน้อยหนึ่งรายการ THEN THE RGA_System SHALL อนุญาตให้ส่งข้อมูล

### Requirement 4: สร้างเอกสาร RGA

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการสร้างเอกสาร RGA หลังจากเลือกเหตุผลและระบุจำนวนสินค้าที่ต้องการยกเลิก เพื่อบันทึกการยกเลิกในระบบ

#### Acceptance Criteria

1. WHEN ผู้ใช้กรอกข้อมูลครบถ้วนและกดปุ่มส่ง THEN THE RGA_System SHALL เรียก API `/rgaSubmit` พร้อมข้อมูลคำสั่งซื้อ เหตุผล และรายการสินค้าที่ยกเลิก
2. WHILE กำลังเรียก API `/rgaSubmit` THEN THE RGA_System SHALL แสดงสถานะกำลังโหลดและปิดการใช้งานปุ่มส่ง
3. WHEN API `/rgaSubmit` ส่งข้อมูล RGA_Document พร้อมหมายเลขอ้างอิงกลับมา THEN THE RGA_System SHALL แสดงข้อความยืนยันความสำเร็จพร้อมหมายเลข RGA
4. WHEN API `/rgaSubmit` ส่งข้อผิดพลาดกลับมา THEN THE RGA_System SHALL แสดงข้อความแจ้งข้อผิดพลาดและเปิดการใช้งานปุ่มส่งอีกครั้ง

### Requirement 5: จัดการ Mock API สำหรับการพัฒนา

**User Story:** ในฐานะนักพัฒนา ฉันต้องการใช้ Mock API ในระหว่างการพัฒนา เพื่อทดสอบการทำงานของ Frontend โดยไม่ต้องรอ Backend API

#### Acceptance Criteria

1. THE Mock_API SHALL ทำงานบน port ที่แตกต่างจาก Frontend application
2. THE Mock_API SHALL มี endpoint `/order` ที่รับ POST request พร้อม order year และ order number
3. THE Mock_API SHALL มี endpoint `/rgaReason` ที่รับ POST request และส่งข้อมูล Main_Reason และ Sub_Reason
4. THE Mock_API SHALL มี endpoint `/rgaSubmit` ที่รับ POST request พร้อมข้อมูล RGA และส่ง RGA_Document พร้อมหมายเลขอ้างอิง
5. FOR ALL Mock_API endpoints THE request และ response format SHALL ตรงกับ Real_API ทุกประการ
6. WHEN เปลี่ยนจาก Mock_API ไปใช้ Real_API THEN THE RGA_System SHALL สามารถเปลี่ยนได้โดยการแก้ไข base URL เท่านั้น

### Requirement 6: ใช้เทคโนโลยีที่กำหนด

**User Story:** ในฐานะนักพัฒนา ฉันต้องการใช้เทคโนโลยีที่กำหนดไว้ เพื่อความสอดคล้องกับมาตรฐานของโครงการ

#### Acceptance Criteria

1. THE RGA_System SHALL ถูกพัฒนาด้วย React framework
2. THE RGA_System SHALL ใช้ Vite เป็น build tool
3. THE RGA_System SHALL ใช้ MUI (Material-UI) เป็น UI component library
4. THE Mock_API SHALL ใช้ JSON Server
5. FOR ALL API calls THE RGA_System SHALL ใช้ POST method

### Requirement 7: กำหนดรูปแบบหมายเลข RGA

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการให้ระบบสร้างหมายเลข RGA ในรูปแบบที่กำหนดไว้โดยอัตโนมัติ เพื่อให้มีมาตรฐานและสามารถอ้างอิงได้ง่าย

#### Acceptance Criteria

1. THE RGA_Number SHALL มีรูปแบบ YYNNNNNNNN โดยมีความยาว 10 หลักเสมอ
2. THE RGA_Number SHALL เริ่มต้นด้วย YY ซึ่งเป็นปี พ.ศ. 2 หลักสุดท้าย (เช่น "26" สำหรับปี 2026)
3. THE RGA_Number SHALL มี NNNNNNNN ซึ่งเป็นหมายเลขลำดับ 8 หลัก โดยเติม 0 ข้างหน้า (เช่น "00002175")
4. WHEN ระบบสร้าง RGA_Document THEN THE RGA_System SHALL สร้าง RGA_Number โดยอัตโนมัติตามรูปแบบที่กำหนด
5. FOR ALL RGA_Number ที่สร้างขึ้น THE format SHALL เป็น YYNNNNNNNN เสมอ (ตัวอย่าง: 2600002175)

### Requirement 8: รองรับการแสดงผลแบบ Responsive

**User Story:** ในฐานะผู้ใช้งาน ฉันต้องการใช้งานแอปพลิเคชันได้บนอุปกรณ์ทุกขนาด เพื่อความสะดวกในการเข้าถึงและใช้งาน

#### Acceptance Criteria

1. THE RGA_System SHALL แสดงผลได้อย่างเหมาะสมบนหน้าจอขนาด desktop, tablet และ mobile
2. WHEN ผู้ใช้เข้าถึงระบบจากอุปกรณ์ต่างขนาด THEN THE RGA_System SHALL ปรับ layout ให้เหมาะสมกับขนาดหน้าจออัตโนมัติ
3. THE RGA_System SHALL ใช้ MUI Grid system และ breakpoints สำหรับการจัดการ Responsive_Layout
4. FOR ALL forms และ data tables THE RGA_System SHALL แสดงผลและใช้งานได้บนอุปกรณ์ mobile
5. WHEN ผู้ใช้เข้าถึงจากหน้าจอขนาดเล็ก THEN THE navigation menu SHALL ปรับรูปแบบให้เหมาะสมกับพื้นที่หน้าจอ
6. FOR ALL interactive elements THE RGA_System SHALL มีขนาดและระยะห่างที่เหมาะสมสำหรับการใช้งานบน touch screen
