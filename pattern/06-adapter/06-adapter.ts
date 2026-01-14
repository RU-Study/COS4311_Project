// + ------------ Target ------------ + //
abstract class THDate {
  protected formatDate(d: Date): string {
    const dayList: string[] = [ "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์" ];
    const monthList: string[] = [ 
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const day = dayList[d.getDay()];
    const date = d.getDate();
    const month = monthList[d.getMonth()];
    const year = d.getFullYear() + 543;

    return `วัน${day}ที่ ${date} ${month} พ.ศ. ${year}`;
  }

  protected formatTime(d: Date): string {
    const addZero = (num: number): string => ('00' + num).slice(-2);
    const hours = addZero(d.getHours());
    const minutes = addZero(d.getMinutes());
    const seconds = addZero(d.getSeconds());

    return `เวลา ${hours}:${minutes}:${seconds} น.`;
  }

  abstract getTHDate(): string;
  abstract getTHTime(): string;
}

// + ------------ Adaptee ------------ + //
class Timestamp {
  private timestamp: number;

  constructor(timestamp: number) {
    this.timestamp = (timestamp > 0) ? timestamp : 0;
  }

  getTimestamp(): number {
    return this.timestamp;
  }
}

class ISO8601 {
  private date: string;

  constructor(date: string) {
    const regEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})$/;

    this.date = (regEx.test(date)) ? date : "1970-01-01T00:00:00";
  }

  getISO8601Date(): string {
    return this.date;
  }
}

// + ------------ Adapter ------------ + //
class TimestampAdapter extends THDate {
  private adaptee: Timestamp;

  constructor(adaptee: Timestamp) {
    super();
    this.adaptee = adaptee;
  }

  getTHDate(): string {
    const date = new Date(this.adaptee.getTimestamp());
    
    return this.formatDate(date);
  }

  getTHTime(): string {
    const date = new Date(this.adaptee.getTimestamp());
    
    return this.formatTime(date);
  }
}

class ISO8601Adapter extends THDate {
  private adaptee: ISO8601;

  constructor(adaptee: ISO8601) {
    super();
    this.adaptee = adaptee;
  }

  getTHDate(): string {
    const date = new Date(this.adaptee.getISO8601Date());
    
    return this.formatDate(date);
  }

  getTHTime(): string {
    const date = new Date(this.adaptee.getISO8601Date());

    return this.formatTime(date);
  }
}

// + ------------ Client ------------ + //
class EmployeeAttendance {
  private empId: string;
  private checkIn: Timestamp;
  private checkOut?: Timestamp;

  constructor(id: string) {
    const timestamp = new Date().getTime();

    this.empId = id;
    this.checkIn = new Timestamp(timestamp);
  }

  setCheckOutTime(): void {
    const timestamp = new Date().getTime();
    
    this.checkOut = new Timestamp(timestamp);
  }

  getId(): string {
    return this.empId;
  }

  getCheckInTime(): Timestamp {
    return this.checkIn;
  }

  getCheckOutTime(): Timestamp | undefined {
    return this.checkOut;
  }
}

class AttendanceManager {
  private attendanceDate: ISO8601;
  private attendances: EmployeeAttendance[] = [];

  constructor(date: string) {
    this.attendanceDate = new ISO8601(date);
  }

  private convertTHDate(date: THDate): string {
    return date.getTHDate();
  }

  private convertTHTime(date: THDate): string {
    return date.getTHTime();
  }

  checkIn(id: string): void {
    let attendance: EmployeeAttendance | undefined;
    
    for (let i = 0; i < this.attendances.length; i++) {
      const employee = this.attendances[i]!;
      
      if (employee.getId() === id) { 
        attendance = employee;
        break;
      }
    }

    if (!attendance) {
      attendance = new EmployeeAttendance(id);
      this.attendances.push(attendance);
    }

    const dateAdapter = new TimestampAdapter(attendance.getCheckInTime());
    const text = `
-------------------- ลงชื่อเข้างาน --------------------

  ${this.convertTHDate(dateAdapter)} ${this.convertTHTime(dateAdapter)}
  หมายเลขประจำตัว: ${id}

----------------------------------------------------
    `;

    console.log(text);
  }

  checkOut(id: string): void {
    let attendance: EmployeeAttendance | undefined;
    
    for (let i = 0; i < this.attendances.length; i++) {
      const employee = this.attendances[i]!;
      
      if (employee.getId() === id) { 
        attendance = employee;
        break;
      }
    }

    if (!attendance) {
      console.log(`ไม่พบข้อมูลการเข้างานของพนักงานหมายเลข: ${id}`);
      return;
    }

    let checkOutTime: Timestamp | undefined = attendance.getCheckOutTime();

    if (!checkOutTime) {
      attendance.setCheckOutTime();
      checkOutTime = attendance.getCheckOutTime();
    }

    const dateAdapter = new TimestampAdapter(checkOutTime!);
    const text = `
-------------------- ลงชื่อออกงาน --------------------

  หมายเลขประจำตัว: ${id}
  วันที่: ${this.convertTHDate(dateAdapter)}
  เวลา: ${this.convertTHTime(dateAdapter)}

----------------------------------------------------
    `;

    console.log(text);
  }
  
  showReport(): void {
    let isoAdapter: ISO8601Adapter = new ISO8601Adapter(this.attendanceDate);
    const dateText = this.convertTHDate(isoAdapter);
    let report: string = `
========================= รายงานการเข้า-ออกงาน =========================

  ประจำ${dateText}

----------------------------------------------------------------------
   `;

    this.attendances.forEach((attendance) => {
      const checkInAdapter = new TimestampAdapter(attendance.getCheckInTime());
      const checkInText = this.convertTHTime(checkInAdapter);
      const checkOutTime = attendance.getCheckOutTime();
      let checkOutText: string;

      if (!checkOutTime) {
        checkOutText = '--:-- น.';
      } else {
        const checkOutAdapter = new TimestampAdapter(attendance.getCheckOutTime()!);

        checkOutText = this.convertTHTime(checkOutAdapter);
      }

      report += `\n  + ${attendance.getId()} :>> เข้างาน: ${checkInText} | ออกงาน: ${checkOutText}`;
    });

    const currentDate = new Date().toISOString();
    const reportDate = new ISO8601(currentDate);

    isoAdapter = new ISO8601Adapter(reportDate);

    const reportText = `${this.convertTHDate(isoAdapter)} ${this.convertTHTime(isoAdapter)}`;

    report += `

----------------------------------------------------------------------

  ออกรายงาน: ${reportText}

======================================================================
    `;

    console.log(report);
  }
}

const attendance20260113 = new AttendanceManager('2026-01-13T00:00:00.000');

attendance20260113.checkIn('E001');

setTimeout(() => {
  console.log(`เวลาปัจจุบัน ${new Date()}`);
  attendance20260113.checkIn('E001');
  
  attendance20260113.checkIn('E002');
  attendance20260113.checkIn('E003');
  attendance20260113.checkIn('E004');
  
  attendance20260113.checkOut('E004');
  attendance20260113.checkOut('E003');
  attendance20260113.checkOut('E002');
  
  attendance20260113.showReport();
}, 1000);