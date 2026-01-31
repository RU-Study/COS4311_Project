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

export { THDate, Timestamp, ISO8601, TimestampAdapter, ISO8601Adapter };