import { ISO8601, ISO8601Adapter, THDate, Timestamp, TimestampAdapter,  } from './06-adapter';


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