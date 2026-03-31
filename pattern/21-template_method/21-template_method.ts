// + --------------------- Abstract Class --------------------- + //
abstract class HouseBuilder {
  
  protected landSize: number;
  protected houseSize: number;
  protected floorMaterial: string;
  protected buildTime: number;

  constructor(landSize: number, houseSize: number, floor: string) {
    this.landSize = landSize;
    this.houseSize = houseSize;
    this.floorMaterial = floor;
    this.buildTime = 0;
  }

  sitePreparation(): void {
    const day = {
      survey: 0,
      clear: 0,
      level: 0
    };

    if (this.landSize > 400) {
      day.survey = 7;
      day.clear = 5;
      day.level = 14;
    } else if (this.landSize > 200) {
      day.survey = 5;
      day.clear = 3;
      day.level = 7;
    } else {
      day.survey = 3;
      day.clear = 2;
      day.level = 4;
    }
    
    console.log('\n-------------------- เตรียมพื้นที่ก่อสร้าง --------------------\n');

    console.log(`  + สำรวจพื้นที่และวางแผนการเตรียมพื้นที่ (${Math.round(day.survey)} วัน)`);
    this.buildTime += day.survey;

    console.log(`  + เคลียร์พื้นที่ (${Math.round(day.clear)} วัน)`);
    this.buildTime += day.clear;

    console.log(`  + ปรับระดับพื้นดิน (${Math.round(day.level)} วัน)`);
    this.buildTime += day.level;

    console.log('\n--------------------------------------------------------\n');
  }
  
  protected abstract buildFoundation(): void;
  protected abstract buildStructure(): void;

  protected concreteTesting(): void {
    return;
  }

  protected abstract buildWalls(): void;
  protected abstract buildRoof(): void;
  
  protected installFloor(): void {
    const day = {
      prepare: 0,
      level: 0,
      lay: 0,
      finish: 0
    };

    if (this.houseSize > 400) {
      day.prepare = 4;
      day.level = 8;
      day.finish = 6;
    } else if (this.houseSize > 200) {
      day.prepare = 3;
      day.level = 6;
      day.finish = 4;
    } else if (this.houseSize > 100) {
      day.prepare = 2;
      day.level = 4;
      day.finish = 2;
    } else {
      day.prepare = 1;
      day.level = 3;
      day.finish = 1;
    }

    switch (this.floorMaterial) {
      case 'กระเบื้อง': day.lay = (this.houseSize / 50) * 3; break;
      case 'SPC': day.lay = (this.houseSize / 50) * 2; break;
      case 'ไม้': day.lay = (this.houseSize / 50) * 5; break;
      default: day.lay = (this.houseSize / 50) * 1; break;
    }
    
    console.log('\n------------------------ ติดตั้งพื้น ------------------------\n');
    
    console.log(`  + เตรียมพื้น (${Math.round(day.prepare)} วัน)`);
    this.buildTime += day.prepare;

    console.log(`  + ปรับระดับพื้น (${Math.round(day.level)} วัน)`);
    this.buildTime += day.level;

    console.log(`  + ปูพื้น${this.floorMaterial} (${Math.round(day.lay)} วัน)`);
    this.buildTime += day.lay;

    console.log(`  + เก็บงาน (${Math.round(day.finish)} วัน)`);
    this.buildTime += day.finish;

    console.log('\n---------------------------------------------------------\n');
  }

  buildHouse(): void {
    this.sitePreparation();
    this.buildFoundation();
    this.buildStructure();
    this.concreteTesting();
    this.buildWalls();
    this.buildRoof();
    this.installFloor();
  }

  getBuildTime(): number {
    return Math.round(this.buildTime);
  }
}

// + --------------------- Concrete Class --------------------- + //
class ConcreteHouse extends HouseBuilder {
  private wallMaterial: string;

  constructor(landSize: number, houseSize: number, floor: string, wall: string) {
    super(landSize, houseSize, floor);
    this.wallMaterial = wall;
  }

  protected buildFoundation(): void {
    let day = 0;

    console.log('\n--------------------- ก่อสร้างฐานราก ---------------------\n');

    day = this.houseSize * 0.02;
    console.log(`  + ตอกเสาเข็ม (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.015;
    console.log(`  + ขุดหลุมสำหรับทำฐานราก (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02;
    console.log(`  + ผูกเหล็ก + ทำแบบ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.010;
    console.log(`  + เทคอนกรีต (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอคอนกรีตเซตตัว (7 วัน)`);
    this.buildTime += 7;

    console.log('\n-------------------------------------------------------\n');
  }

  protected buildStructure(): void {
    let day = 0;

    console.log('\n-------------------- ก่อสร้างโครงสร้าง --------------------\n');
    
    day = this.houseSize * 0.02;
    console.log(`  + ตั้งแบบ + ผูกเหล็กเสา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + เทคอนกรีตเสา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอคอนกรีตเซตตัว (5 วัน)`);
    this.buildTime += 5;

    day = this.houseSize * 0.01;
    console.log(`  + ถอดแบบ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02;
    console.log(`  + ตั้งแบบคาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02;
    console.log(`  + ผูกเหล็กคาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.015;
    console.log(`  + เทคอนกรีตคาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอคอนกรีตเซตตัว (5 วัน)`);
    this.buildTime += 5;

    day = this.houseSize * 0.01;
    console.log(`  + ถอดแบบ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');
  }

  protected override concreteTesting(): void {
    
    let day = 0;
    
    console.log('\n-------------------- ตรวจสอบคอนกรีต --------------------\n');
    
    day = this.houseSize * 0.006;
    console.log(`  + ตรวจผิวคอนกรีตทั้งหมด (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.005;
    console.log(`  + ตรวจแนวดิ่ง–แนวระนาบ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.005;
    console.log(`  + ตรวจรอยร้าว (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.006;
    console.log(`  + ตรวจการโก่งตัว (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.004;
    console.log(`  + ตรวจตำแหน่งโครงสร้าง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + ทดสอบกำลังคอนกรีต (14 วัน)`);
    this.buildTime += 14;

    day = this.houseSize * 0.006;
    console.log(`  + ตรวจความพร้อมก่อนงานสถาปัตย์ (${Math.round(day)} วัน)`);
    this.buildTime += day;
    
    console.log('\n-------------------------------------------------------\n');
  }

  protected buildWalls(): void {
    let day = 0;

    console.log(`\n-------------------${this.wallMaterial === 'อิฐมอญ' ? '- ก่อกำแพงอิฐมอญ -' : ' ก่อกำแพงอิฐมวลเบา '}-------------------\n`);
    
    day = this.houseSize * 0.004;
    console.log(`  + วางแนวผนัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.025;
    console.log(`  + ก่ออิฐ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ฝังท่อไฟและท่อน้ำประปา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02
    console.log(`  + ฉาบผนัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอปูนเซตตัว (1 วัน)`);
    this.buildTime += 1;

    day = this.houseSize * 0.006;
    console.log(`  + เก็บงาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');
  }

  protected buildRoof(): void {
    let day = 0;

    console.log('\n---------------------- ติดตั้งหลังคา ----------------------\n');
    
    day = this.houseSize * 0.02;
    console.log(`  + ติดตั้งโครงหลังคา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.012;
    console.log(`  + ติดตั้งแป (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.030;
    console.log(`  + มุงหลังคา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ติดตั้งครอบสันจั่วและครอบข้าง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.005;
    console.log(`  + ตรวจสอบและเก็บงาน (${Math.round(day)} วัน)`);
    this.buildTime += day;
    
    console.log('\n-------------------------------------------------------\n');
  }
}

class WoodenHouse extends HouseBuilder {
  constructor(landSize: number, houseSize: number, floor: string) {
    super(landSize, houseSize, floor);
  }

  protected buildFoundation(): void {
    let day = 0;

    console.log('\n--------------------- ก่อสร้างฐานราก ---------------------\n');

    day = this.houseSize * 0.003;
    console.log(`  + วางผัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.008;
    console.log(`  + ขุดหลุมสำหรับทำตอม่อ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + เทคอนกรีตตอม่อ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอคอนกรีตเซตตัว (5 วัน)`);
    this.buildTime += 5;
    
    console.log('\n-------------------------------------------------------\n');
  }

  protected buildStructure(): void {
    let day = 0;

    console.log('\n-------------------- ก่อสร้างโครงสร้าง --------------------\n');
    
    day = this.houseSize * 0.017;
    console.log(`  + ตั้งเสาไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;
    
    day = this.houseSize * 0.02;
    console.log(`  + วางคานไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;
    
    day = this.houseSize * 0.02;
    console.log(`  + วางตงพื้น (${Math.round(day)} วัน)`);
    this.buildTime += day;
    
    day = this.houseSize * 0.008;
    console.log(`  + ปรับระดับและเก็บงาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');    
  }

  protected buildWalls(): void {
    let day = 0;
    
    console.log('\n----------------------- ก่อกำแพง -----------------------\n');
    
    day = this.houseSize * 0.015;
    console.log(`  + วางแนวผนัง และติดตั้งโครงคร่าวไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02;
    console.log(`  + ติดตั้งแผ่นผนังไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.008;
    console.log(`  + ติดตั้งท่อไฟและท่อน้ำประปา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + อุดรอยต่อและขัดปรับผิวไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.012;
    console.log(`  + ทาสีและเคลือบผิวไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');    
  }

  protected buildRoof(): void {
    let day = 0;
    
    console.log('\n---------------------- ติดตั้งหลังคา ----------------------\n');
    
    day = this.houseSize * 0.025;
    console.log(`  + ติดตั้งโครงหลังคาไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.15;
    console.log(`  + ติดตั้งแปไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ปูแผ่นรองกันน้ำและฉนวน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.03;
    console.log(`  + มุงหลังคา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.012;
    console.log(`  + ติดตั้งครอบสันจั่ว (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.012;
    console.log(`  + ทาสีและเคลือบผิวไม้ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');
  }
}

class SteelFrameHouse extends HouseBuilder {
  constructor(landSize: number, houseSize: number, floor: string) {
    super(landSize, houseSize, floor);
  }

  protected buildFoundation(): void {
    let day = 0;

    console.log('\n--------------------- ก่อสร้างฐานราก ---------------------\n');

    day = this.houseSize * 0.005;
    console.log(`  + วางผัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ขุดหลุมสำหรับทำตอม่อ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.015;
    console.log(`  + วางเหล็กตอม่อ (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.008;
    console.log(`  + เทคอนกรีต (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log(`  + รอคอนกรีตเซตตัว (5 วัน)`);
    this.buildTime += 5;

    console.log('\n-------------------------------------------------------\n');    
  }

  protected buildStructure(): void {
    let day = 0;

    console.log('\n-------------------- ก่อสร้างโครงสร้าง --------------------\n');
    
    day = this.houseSize * 0.014;
    console.log(`  + ตั้งเสาเหล็ก (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.014;
    console.log(`  + ติดตั้งคาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.014;
    console.log(`  + ติดตั้งโครงพื้น (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.005;
    console.log(`  + เก็บงาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');    
  }

  protected buildWalls(): void {
    let day = 0;
    
    console.log('\n----------------------- ก่อกำแพง -----------------------\n');

    day = this.houseSize * 0.012;
    console.log(`  + วางแนวและติดตั้งโครงคร่าวเหล็ก (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.008;
    console.log(`  + ติดตั้งท่อไฟและท่อน้ำประปา (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.006;
    console.log(`  + ติดตั้งฉนวนกันเสียงและกันร้อน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.015;
    console.log(`  + ติดตั้งแผ่นผนัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.012;
    console.log(`  + ฉาบรอยต่อและขัดผิว (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ทาสีผนัง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');    
  }

  protected buildRoof(): void {
    let day = 0;
    
    console.log('\n---------------------- ติดตั้งหลังคา ----------------------\n');
    
    day = this.houseSize * 0.018;
    console.log(`  + ติดตั้งโครงหลังคาเหล็ก (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ติดตั้งแปเหล็ก (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.008;
    console.log(`  + ติดตั้งฉนวนกันความร้อน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.02;
    console.log(`  + ติดตั้งแผ่นเมทัลชีท (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.01;
    console.log(`  + ปิดรอยต่อและครอบข้าง (${Math.round(day)} วัน)`);
    this.buildTime += day;

    day = this.houseSize * 0.005;
    console.log(`  + ตรวจสอบและเก็บงาน (${Math.round(day)} วัน)`);
    this.buildTime += day;

    console.log('\n-------------------------------------------------------\n');    
  }
}

// + ------------------------- Client ------------------------- + //
const concreteHouse = new ConcreteHouse(400, 600, 'กระเบื้อง', 'อิฐมอญ');

concreteHouse.buildHouse();
console.log(`\nเวลาที่ใช้ในการก่อสร้างบ้านคอนกรีต: ${concreteHouse.getBuildTime()} วัน\n`);

const woodenHouse = new WoodenHouse(100, 150, 'ไม้');

woodenHouse.buildHouse();
console.log(`\nเวลาที่ใช้ในการก่อสร้างบ้านไม้: ${woodenHouse.getBuildTime()} วัน\n`);

const steelFrameHouse = new SteelFrameHouse(200, 350, 'SPC');

steelFrameHouse.buildHouse();
console.log(`\nเวลาที่ใช้ในการก่อสร้างบ้านโครงเหล็ก: ${steelFrameHouse.getBuildTime()} วัน\n`);