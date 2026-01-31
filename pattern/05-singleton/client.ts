import { ComputerClock } from './05-singleton';

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