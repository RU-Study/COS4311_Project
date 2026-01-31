// + ------------ Singleton ------------ + //
class ComputerClock {
  private static clock: ComputerClock;
  private day: number;
  private month: number;
  private year: number;
  private hours: number;
  private minutes: number;
  private seconds: number;

  private constructor() {
    this.day = 1;
    this.month = 1;
    this.year = 1970;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  setDate(dd: number, mm: number, yyyy: number): void {
    this.day = dd;
    this.month = mm;
    this.year = yyyy;
  }

  setTime(hh: number, mm: number, ss: number): void {
    this.hours = hh;
    this.minutes = mm;
    this.seconds = ss;
  }

  static getClock(): ComputerClock {

    if (!ComputerClock.clock) {
      ComputerClock.clock = new ComputerClock();
    }

    return ComputerClock.clock;
  }
  
  getDay(): number {
    return this.day;
  }

  getMonth(): number {
    return this.month;
  }
  
  getYear(): number {
    return this.year;
  }

  getHours(): number {
    return this.hours;
  }

  getMinutes(): number {
    return this.minutes;
  }
  
  getSeconds(): number {
    return this.seconds;
  }
}

export { ComputerClock };