interface AirConditioner {
  powerOn(): void;
  powerOff(): void;
  setTemp(temp: number): void;
  increaseTemp(): void;
  decreaseTemp(): void;
  setFanSpeed(speed: number): void;
  increaseFanSpeed(): void;
  decreaseFanSpeed(): void;
  showStatus(): void;
}

class RealAir implements AirConditioner {
  private isPowerOn: boolean = false;
  private temperature: number = 25;
  private fanSpeed: number = 3;

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

  increaseTemp(): void {
    if (!this.isPowerOn) {
    
      console.log('แอร์ปิดอยู่ !');
    
    } else if (this.temperature < 30) {
      
      this.temperature++;
      console.log(`เพิ่มอุณภูมิเป็น ${this.temperature} °C แล้ว`);
    
    } else {

      console.log('ไม่สามารถเพิ่มอุณหภูมิได้สูงกว่า 30°C');
    
    }
  }

  decreaseTemp(): void {    
    if (!this.isPowerOn) {
    
      console.log('แอร์ปิดอยู่ !');
    
    } else if (this.temperature > 16) {
      
      this.temperature++;
      console.log(`ลดอุณภูมิเป็น ${this.temperature} °C แล้ว`);
    
    } else {

      console.log('ไม่สามารถลดอุณหภูมิได้ต่ำกว่า 16°C');
    
    }
  }

  setFanSpeed(speed: number): void {
    if (!this.isPowerOn) {

      console.log('แอร์ปิดอยู่ !');

    } else if (speed >= 1 && speed <= 5) {

      this.fanSpeed = speed;
      console.log(`ปรับความแรงลมเป็นระดับ ${this.fanSpeed} แล้ว`);

    } else {

      console.log('ปรับความแรงลมได้ระหว่าง 1-5 เท่านั้น');
    
    }
  }

  increaseFanSpeed(): void {
    if (!this.isPowerOn) {
    
      console.log('แอร์ปิดอยู่ !');
    
    } else if (this.fanSpeed < 5) {
      
      this.temperature++;
      console.log(`เพิ่มความแรงลมเป็นระดับ ${this.fanSpeed} แล้ว`);
    
    } else {

      console.log('ไม่สามารถเพิ่มความแรงลมได้สูงกว่า 5');
    
    }
  }

  decreaseFanSpeed(): void {
    if (!this.isPowerOn) {
    
      console.log('แอร์ปิดอยู่ !');
    
    } else if (this.fanSpeed > 1) {
      
      this.temperature++;
      console.log(`ลดความแรงลมเป็นระดับ ${this.fanSpeed} แล้ว`);
    
    } else {

      console.log('ไม่สามารถลดความแรงลมได้ต่ำกว่า 1');
    
    }
  }

  showStatus(): void {
    if (!this.isPowerOn) {
      console.log('แอร์ปิดอยู่ !');
      return;
    } 
    
    console.log(`สถานะ: ${this.isPowerOn ? 'เปิด' : 'ปิด'}\nอุณหภูมิ: ${this.temperature} °C\nระดับพัดลม: ${this.fanSpeed}`);
  }
}

class AirControllerApp implements AirConditioner {
  private realAir: RealAir;
  private userLevel: number; // ? 1: ผู้ใช้ทั่วไป, 2: ผู้ใช้ระดับกลาง, 3: Admin

  constructor(realAir: RealAir, userLevel: number) {
    this.realAir = realAir;

    this.userLevel = (userLevel >= 1 && userLevel <= 3) ? userLevel : 1;
  }

  private verify(reqLevel: number): boolean {
    if (this.userLevel < reqLevel) {
      console.log('คุณไม่มีสิทธิ์ใช้งานฟังก์ชั่นนี้');
      
      return false;
    }
    
    return true;
  }

  powerOn(): void {
    this.realAir.powerOn();
  }

  powerOff(): void {
    this.realAir.powerOff();
  }

  setTemp(temp: number): void {
    if (this.verify(3)) {
      this.realAir.setTemp(temp);
    }
  }

  increaseTemp(): void {
    if (this.verify(2)) {
      this.realAir.increaseTemp();
    }
  }

  decreaseTemp(): void {
    if (this.verify(2)) {
      this.realAir.decreaseTemp();
    }
  }

  setFanSpeed(speed: number): void {
    if (this.verify(3)) {
      this.realAir.setFanSpeed(speed);
    }
  }

  increaseFanSpeed(): void {
    if (this.verify(1)) {
      this.realAir.increaseFanSpeed();
    }
  }

  decreaseFanSpeed(): void {
    if (this.verify(1)) {
      this.realAir.decreaseFanSpeed();
    }
  }

  showStatus(): void {
    this.realAir.showStatus();
  }
}

const airConditioner = new RealAir();
const user1 = new AirControllerApp(airConditioner, 1);
const user2 = new AirControllerApp(airConditioner, 2);
const user3 = new AirControllerApp(airConditioner, 3);

console.log('---------- Real Air ----------\n');

airConditioner.powerOn();
airConditioner.showStatus();
airConditioner.powerOff();

console.log('\n----------- USER 1 -----------\n');
user1.powerOn();
user1.setTemp(20);
user1.increaseTemp();
user1.decreaseTemp();
user1.setFanSpeed(5);
user1.increaseFanSpeed();
user1.decreaseFanSpeed();
console.log('\n--------------------------------\n');
user1.showStatus();
user1.powerOff();

console.log('\n----------- USER 2 -----------\n');
user2.powerOn();
user2.setTemp(20);
user2.increaseTemp();
user2.decreaseTemp();
user2.setFanSpeed(5);
user2.increaseFanSpeed();
user2.decreaseFanSpeed();
console.log('\n--------------------------------\n');
user2.showStatus();
user2.powerOff();

console.log('\n----------- USER 3 -----------\n');

user3.setTemp(20);
user3.powerOn();
user3.setTemp(20);
user3.increaseTemp();
user3.decreaseTemp();
user3.setFanSpeed(5);
user3.increaseFanSpeed();
user3.decreaseFanSpeed();
console.log('\n--------------------------------\n');
user3.showStatus();
user3.powerOff();

console.log('\n----------- USER 2 -----------\n');
user2.showStatus();

console.log('\n----------- USER 1 -----------\n');
user1.showStatus();
