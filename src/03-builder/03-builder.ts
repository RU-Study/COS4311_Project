// + Product + //
class Fan {
  private size: number;
  private hasPCB: boolean = false;

  constructor(size: number) {
    this.size = size;
  }

  setMotor(): void {
    console.log("ผลิตมอเตอร์พัดลมแล้ว...");
  }
  
  setBlade(): void {
    console.log("ผลิตใบพัดพัดลมแล้ว...");
  }
  
  setGuard(): void {
    console.log("ผลิตโครงพัดลมแล้ว...");
  }
  
  setPCB(): void {
    this.hasPCB = true;
    console.log("ผลิตแผงวงตรควบคุมแล้ว...");
  } 

  show(): void {
    console.log(`\nพัดลม${this.hasPCB ? "ระบบอิเล็กทรอนิกส์": ""}ขนาด ${this.size} นิ้ว`);
  }
}

// + Builder + //
interface Builder {
  reset(): void; 
  buildMotor(): void;
  buildBlades(): void;
  buildGuard(): void;
  buildPCB(): void;
}

// + Concrete Builder + //
class Fan14InchBuilder implements Builder {
  private fan: Fan;
  
  constructor() {
    this.fan = new Fan(14);
  }

  reset(): void {
    this.fan = new Fan(14);
  }

  buildMotor(): void {
    this.fan.setMotor();
  }

  buildBlades(): void {
    this.fan.setBlade();
  }

  buildGuard(): void {
    this.fan.setGuard();
  }

  buildPCB(): void {
    this.fan.setPCB();
  }

  getResult(): Fan {
    return this.fan;
  }
}

class Fan16InchBuilder implements Builder {
  private fan: Fan;
  
  constructor() {
    this.fan = new Fan(16);
  }

  reset(): void {
    this.fan = new Fan(16);
  }

  buildMotor(): void {
    this.fan.setMotor();
  }

  buildBlades(): void {
    this.fan.setBlade();
  }

  buildGuard(): void {
    this.fan.setGuard();
  }

  buildPCB(): void {
    this.fan.setPCB();
  }

  getResult(): Fan {
    return this.fan;
  }
}

// + Director + //
class Director {
  private builder: Builder;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  changeBuilder(builder: Builder): void {
    this.builder = builder;

    console.log("เปลี่ยน builder แล้ว");
  }

  buildMechanicalFan(): void {
    this.builder.reset();
    this.builder.buildMotor();
    this.builder.buildBlades();
    this.builder.buildGuard();
  }

  buildElectronicFan(): void {
    this.builder.reset();
    this.builder.buildMotor();
    this.builder.buildBlades();
    this.builder.buildGuard();
    this.builder.buildPCB();
  }
}

// + Client + //
const builder14Inch = new Fan14InchBuilder();
let director = new Director(builder14Inch);

console.log("\n------------------------------\n");

director.buildMechanicalFan();
builder14Inch.getResult().show();
console.log("\n------------------------------\n");

director.buildElectronicFan();
builder14Inch.getResult().show();
console.log("\n------------------------------\n");


const builder16Inch = new Fan16InchBuilder();
director.changeBuilder(builder16Inch);
console.log("\n------------------------------\n");

director.buildMechanicalFan();
builder16Inch.getResult().show();
console.log("\n------------------------------\n");

director.buildElectronicFan();
builder16Inch.getResult().show();
console.log("\n------------------------------\n");