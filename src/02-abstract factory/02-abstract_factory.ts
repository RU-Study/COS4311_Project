// + Product + //
interface Blades {
  make(): void;
}

interface Motor {
  make(): void;
}

interface Guard {
  make(): void;
}

// + Concrete Products + //
class Blades14Inch implements Blades {
  make(): void {
    console.log("ผลิตใบพัดลมขนาด 14 นิ้วแล้ว...");
  }
}

class Blades16Inch implements Blades {
  make(): void {
    console.log("ผลิตใบพัดลมขนาด 16 นิ้วแล้ว...");
  }
}

class Blades18Inch implements Blades {
  make(): void {
    console.log("ผลิตใบพัดลมขนาด 18 นิ้วแล้ว...");
  }
}

class Motor14Inch implements Motor {
  make(): void {
    console.log("ผลิตมอเตอร์สำหรับพัดลมขนาด 14 นิ้วแล้ว...");
  }
}

class Motor16Inch implements Motor {
  make(): void {
    console.log("ผลิตมอเตอร์สำหรับพัดลมขนาด 16 นิ้วแล้ว...");
  }
}

class Motor18Inch implements Motor {
  make(): void {
    console.log("ผลิตมอเตอร์สำหรับพัดลมขนาด 18 นิ้วแล้ว...");
  }
}

class Guard14Inch implements Guard {
  make(): void {
    console.log("ผลิตโครงสำหรับพัดลมขนาด 14 นิ้วแล้ว...");
  }
}

class Guard16Inch implements Guard {
  make(): void {
    console.log("ผลิตโครงสำหรับพัดลมขนาด 16 นิ้วแล้ว...");
  }
}

class Guard18Inch implements Guard {
  make(): void {
    console.log("ผลิตโครงสำหรับพัดลมขนาด 18 นิ้วแล้ว...");
  }
}

// + Abstract Factory + //
interface FanFactory {
  createBlade(): Blades;
  createMotor(): Motor;
  createGuard(): Guard;
}

// + Concrete Factory + //
class Fan14InchFactory implements FanFactory {
  createBlade(): Blades {
    return new Blades14Inch();
  }

  createMotor(): Motor {
    return new Motor14Inch();
  }

  createGuard(): Guard {
    return new Guard14Inch();
  }
}

class Fan16InchFactory implements FanFactory {
  createBlade(): Blades {
    return new Blades16Inch();
  }

  createMotor(): Motor {
    return new Motor16Inch();
  }

  createGuard(): Guard {
    return new Guard16Inch();
  }
}

class Fan18InchFactory implements FanFactory {
  createBlade(): Blades {
    return new Blades18Inch();
  }

  createMotor(): Motor {
    return new Motor18Inch();
  }

  createGuard(): Guard {
    return new Guard18Inch();
  }
}

// + Client Class + //
class Client {
  private factory: FanFactory;
  private blade!: Blades;
  private motor!: Motor;
  private guard!: Guard;

  constructor(factory: FanFactory) {
    this.factory = factory;
    this.createParts();
  }

  createParts() {
    this.blade = this.factory.createBlade();
    this.motor = this.factory.createMotor();
    this.guard = this.factory.createGuard();
  }

  make() {
    this.blade.make();
    this.motor.make();
    this.guard.make();
  }
}

// * พัดลม 14 นิ้ว * //
let factory = new Fan14InchFactory();
let client = new Client(factory);

console.log("\n------------------------------\n");
client.make();

console.log("\n------------------------------\n");

// * พัดลม 16 นิ้ว * //
factory = new Fan16InchFactory();
client = new Client(factory);

client.make();

console.log("\n------------------------------\n");

// * พัดลม 18 นิ้ว * //
factory = new Fan18InchFactory();
client = new Client(factory);

client.make();
console.log("\n------------------------------\n");

// + Client Function * //
function clientFunc(factory: FanFactory) {
  factory.createBlade().make();
  factory.createMotor().make();
  factory.createGuard().make();
}

// * พัดลม 14 นิ้ว * //
factory = new Fan14InchFactory();
clientFunc(factory);
console.log("\n------------------------------\n");

// * พัดลม 16 นิ้ว * //
factory = new Fan16InchFactory();
clientFunc(factory);
console.log("\n------------------------------\n");

// * พัดลม 18 นิ้ว * //
factory = new Fan18InchFactory();
clientFunc(factory);
console.log("\n------------------------------\n");