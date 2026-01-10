// + ------------ Implementation ------------ + //
interface RoofMaterial {
  buildRoof(): string;
}

class Terracotta implements RoofMaterial {
  private shape: string;

  constructor(shape: string) {
    this.shape = shape;
  }

  buildRoof(): string {
    console.log("ดำเนินการเตรียมดิน");
    console.log(`ดำเนินการขึ้นรูปกระเบื้อง (รูปทรง: ${this.shape})`);
    console.log("ดำเนินการอบแห้งกระเบื้อง");
    console.log("ดำเนินการเผากระเบื้อง");
    console.log("ดำเนินการเคลือบกระเบื้อง");
    console.log("ดำเนินการตรวจสอบคุณภาพ");

    return `หลังคากระเบื้องดินเผารูปทรง${this.shape}`;
  }
}

class MetalSheet implements RoofMaterial {
  private color: string;

  constructor(color: string) {
    this.color = color;
  }

  buildRoof(): string {
    console.log("ดำเนินการเตรียมแผ่นเหล็ก");
    console.log("ดำเนินการปรับความเรียบของแผ่นเหล็ก");
    console.log("ดำเนินการรีดแผ่นเหล็กให้ขึ้นเป็นลอน");
    console.log("ดำเนินการตัดแผ่นตามความยาว");
    console.log(`ดำเนินการการเคลือบและอบสี${this.color}`);
    console.log("ดำเนินการตรวจสอบคุณภาพ");
    
    return `หลังคาเมทัลชีทสี${this.color}`;
  }
}

// + ------------ Abstraction ------------ + //
abstract class Building {
  protected material: RoofMaterial;

  protected constructor(material: RoofMaterial) {
    this.material = material;
  }

  abstract construction(): void;
}

class House extends Building {
  constructor(material: RoofMaterial) {
    super(material);
  }

  construction(): void {
    const roof = this.material.buildRoof();

    console.log("\nดำเนินการก่อสร้างงานฐานราก");
    console.log("ดำเนินการก่อสร้างงานโครงสร้าง");
    console.log(`ดำเนินการติดตั้ง${roof}`);
    console.log("ดำเนินการก่อผนัง");
    console.log("ดำเนินการติดตั้งระบบน้ำและไฟฟ้า");
    console.log("ดำเนินการตกแต่งบ้าน");
  }
}

class Commercial extends Building {
  constructor(material: RoofMaterial) {
    super(material);
  }

  construction(): void {
    const roof = this.material.buildRoof();
    
    console.log("\nดำเนินการก่อสร้างงานฐานราก");
    console.log("ดำเนินการก่อสร้างงานโครงสร้าง");
    console.log(`ดำเนินการติดตั้ง${roof}`);
    console.log("ดำเนินการก่อผนัง");
    console.log("ดำเนินการติดตั้งระบบน้ำและไฟฟ้า");
    console.log("ดำเนินการตกแต่งตึกแถว");
  }
}

// + ------------ Client ------------ + //
const terracottaRoof = new Terracotta('เกร็ดปลา');
const metalSheetRoof = new MetalSheet('น้ำเงิน');

console.log("---------------------------------------");


let house = new House(terracottaRoof);
house.construction();
console.log("---------------------------------------");

house = new House(metalSheetRoof);
house.construction();
console.log("---------------------------------------");

let commercial = new Commercial(terracottaRoof);
commercial.construction()
console.log("---------------------------------------");

commercial = new Commercial(metalSheetRoof);
commercial.construction()
console.log("---------------------------------------");