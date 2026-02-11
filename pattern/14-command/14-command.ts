// + -------------------- Subject ------------------- + //
interface AirConditioner {
  powerOn(): void;
  powerOff(): void;
  setTemp(temp: number): void;
  showStatus(): void;
}

// + ------------ Real Subject / Receiver ----------- + //
class RealAir implements AirConditioner {
  private isPowerOn: boolean = false;
  private temperature: number = 25;

  powerOn(): void {
    
    if (this.isPowerOn) {
      console.log('แอร์เปิดอยู่แล้ว !');
      return;
    }

    this.isPowerOn = true;
    console.log('เปิดใช้งานแอร์แล้ว');
  }

  powerOff(): void {
    if (!this.isPowerOn) {
      console.log('แอร์ปิดอยู่แล้ว !');
      return;
    }

    this.isPowerOn = false;
    console.log('ปิดใช้งานแอร์แล้ว');
  }

  setTemp(temp: number): void {
    if (!this.isPowerOn) {
      
      console.log('แอร์ปิดอยู่ !');

    } else if (temp >= 16 && temp <= 30) {
      
      this.temperature = temp;
      console.log(`ปรับอุณภูมิเป็น ${this.temperature}°C แล้ว`);
    
    } else {
      console.log('ปรับอุณหภูมิได้ระหว่าง 16-30°C เท่านั้น');
    }
  }

  getTemp(): number {
    return this.temperature;
  }

  showStatus(): void {
    if (!this.isPowerOn) {
      console.log('แอร์ปิดอยู่ !');
      return;
    } 

    console.log(`สถานะ: เปิด\nอุณหภูมิ: ${this.temperature} °C`);
  }
}

// + -------------------- Command -------------------- + //
interface Command {
  execute(): void;
}

// + ---------------- Concrete Command --------------- + //
class TurnOnAirCommand implements Command {
  private realAir: RealAir;
  
  constructor(realAir: RealAir) {
    this.realAir = realAir;
  }
  
  execute(): void {
    this.realAir.powerOn();
  }
}

class TurnOffAirCommand implements Command {
  private realAir: RealAir;

  constructor(realAir: RealAir) {
    this.realAir = realAir;
  }

  execute(): void {
    this.realAir.powerOff();
  }
}

class SetTempCommand implements Command {
  private realAir: RealAir;
  private temperature: number;

  constructor(realAir: RealAir, temp: number) {
    this.realAir = realAir;
    this.temperature = temp;
  }

  execute(): void {
    this.realAir.setTemp(this.temperature);
  }

}

class IncreaseTempCommand implements Command {
  private realAir: RealAir;

  constructor(realAir: RealAir) {
    this.realAir = realAir;
  }

  execute(): void {
    const currentTemp = this.realAir.getTemp();

    this.realAir.setTemp(currentTemp + 1);
  }
}

class DecreaseTempCommand implements Command {
  private realAir: RealAir;
  
  constructor(realAir: RealAir) {
    this.realAir = realAir;
  }

  execute(): void {
    const currentTemp = this.realAir.getTemp();

    this.realAir.setTemp(currentTemp - 1);
  }
}

// + -------------------- Invoker -------------------- + //
class AirController {
  private command?: Command;

  setCommand(command: Command): void {
    this.command = command;
  }

  executeCommand(): void {
    if (!this.command) {
      console.log('ไม่มีคำสั่งให้ทำงาน');
      return;
    }
    
    this.command.execute();
  }
}

// + --------------------- Proxy --------------------- + //
class AirControllerApp implements AirConditioner {
  private realAir: RealAir;
  private controller: AirController;
  private userLevel: number; // ? 1: ผู้ใช้ทั่วไป, 2: ผู้ใช้ระดับกลาง, 3: Admin

  constructor(realAir: RealAir, userLevel: number) {
    this.realAir = realAir;
    this.controller = new AirController();

    if (userLevel < 1 || userLevel > 3) {
      this.userLevel = 1;
    } else {
      this.userLevel = userLevel;
    }
  }

  private verify(reqLevel: number): boolean {
    if (this.userLevel < reqLevel) {
      console.log('คุณไม่มีสิทธิ์ใช้งานฟังก์ชั่นนี้');
      
      return false;
    }
    
    return true;
  }

  powerOn(): void {
    const command = new TurnOnAirCommand(this.realAir);

    this.controller.setCommand(command);
    this.controller.executeCommand();
  }

  powerOff(): void {
    const command = new TurnOffAirCommand(this.realAir);

    this.controller.setCommand(command);
    this.controller.executeCommand();
  }

  setTemp(temp: number): void {
    if (this.verify(3)) {
      const command = new SetTempCommand(this.realAir, temp);
      
      this.controller.setCommand(command);
      this.controller.executeCommand();
    }
  }

  increaseTemp(): void {
    if (this.verify(2)) {
      const command = new IncreaseTempCommand(this.realAir);
      
      this.controller.setCommand(command);
      this.controller.executeCommand();
    }
  }

  decreaseTemp(): void {
    if (this.verify(2)) {
      const command = new DecreaseTempCommand(this.realAir);
      
      this.controller.setCommand(command);
      this.controller.executeCommand();
    }
  }

  showStatus(): void {
    this.realAir.showStatus();
  }
}

// + -------------------- Client --------------------- + //
const airConditioner = new RealAir();
const user1 = new AirControllerApp(airConditioner, 1);
const user2 = new AirControllerApp(airConditioner, 2);
const user3 = new AirControllerApp(airConditioner, 3);

console.log('\n----------- USER 1 -----------\n');
user1.powerOn();
user1.setTemp(20);
user1.increaseTemp();
user1.decreaseTemp();
console.log('\n--------------------------------\n');
user1.showStatus();
user1.powerOff();

console.log('\n----------- USER 2 -----------\n');
user2.powerOn();
user2.setTemp(20);
user2.increaseTemp();
user2.decreaseTemp();
console.log('\n--------------------------------\n');
user2.showStatus();
user2.powerOff();

console.log('\n----------- USER 3 -----------\n');

user3.setTemp(20);
user3.powerOn();
user3.setTemp(20);
user3.increaseTemp();
user3.decreaseTemp();
console.log('\n--------------------------------\n');
user3.showStatus();
user3.powerOff();

console.log('\n----------- USER 2 -----------\n');
user2.showStatus();

console.log('\n----------- USER 1 -----------\n');
user1.powerOn();
user1.showStatus();