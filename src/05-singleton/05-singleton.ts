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

// + ------------ Client ------------ + //
function addZero(num: number): string {
  return ('00' + num).slice(-2);
}

function printDate(clock: ComputerClock): void {
  console.log('------------------------------\n');
  console.log(`วันที่: ${addZero(clock.getDay())}/${addZero(clock.getMonth())}/${addZero(clock.getYear())}`);
  console.log(`เวลา: ${addZero(clock.getHours())}:${addZero(clock.getMinutes())}:${addZero(clock.getSeconds())}`);
  console.log('\n------------------------------');
}

const clock1 = ComputerClock.getClock();

clock1.setDate(19, 12, 2025);
clock1.setTime(17, 30, 21);

console.log('------------------------------');
console.log('Clock 1');
printDate(clock1);

const clock2 = ComputerClock.getClock();

console.log('Clock 2');
printDate(clock2);

clock2.setDate(1, 1, 2026);
clock2.setTime(0, 0, 0);

console.log('Clock 2');
printDate(clock2);

console.log('Clock 1');
printDate(clock1);