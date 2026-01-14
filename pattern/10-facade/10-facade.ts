// + ------------ Subsystem ------------ + //
class Concrete {
  mixConcrete(cement: number, sand: number, rock: number): string {
    console.log(`ผสมปูนซีเมน ${cement} ส่วน`);
    console.log(`ผสมทราย ${sand} ส่วน`);
    console.log(`ผสมหิน ${rock} ส่วน`);
    
    return `${rock > 0 ? "คอนกรีต" : 'ปูนมอร์ตาร์'} อัตราส่วน ${cement}:${sand}:${rock}`;
  }

  buildPole(): void {
    console.log('\n-------------- สร้างเสา --------------\n')
    
    console.log(`วางและผูกเหล็กเสริม`);
    console.log(`ทำไม้แบบเสา`);

    const concrete = this.mixConcrete(1, 2, 3);

    console.log(`เท${concrete} ลงในแบบ`);
    console.log(`ถอดไม้แบบ`);
    console.log('\n------------------------------------\n');
  }

  buildBeam(): void {
    console.log('\n-------------- สร้างคาน --------------\n')
    
    console.log(`วางและผูกเหล็กเสริม`);
    console.log(`ทำไม้แบบคาน`);

    const concrete = this.mixConcrete(1, 2, 3);

    console.log(`เท${concrete} ลงในแบบ`);
    console.log(`ถอดไม้แบบ`);
    console.log('\n------------------------------------\n');
  }

  buildFloor(): void {
    console.log('\n--------------- เทพื้น ---------------\n')

    console.log(`ปรับระดับดิน`);
    console.log(`ทำไม้แบบขอบพื้น`);
    console.log(`วางและผูกเหล็กเสริม`);
    
    const concrete = this.mixConcrete(1, 2, 3);
    
    console.log(`เท${concrete} ลงในแบบ`);
    console.log(`ปรับระดับพื้น`);
    console.log(`ขัดผิวหน้า`);
    console.log(`ถอดไม้แบบ`);
    console.log('\n------------------------------------\n');
  }
}

class Wall {

  buildClayBrickWall(): void {
    console.log('\n---------- ก่อกำแพงอิฐมอญ -----------\n')

    const concrete = new Concrete().mixConcrete(1, 3, 0);

    console.log(`ก่ออิฐมอญด้วย${concrete}`);
    console.log(`ฉาบผนังด้วย${concrete}`);
    console.log(`ทาสีผนัง`);
    console.log('\n------------------------------------\n');
  }

  buildAACBlockWall(): void {
    console.log('\n--------- ก่อกำแพงอิฐมวลเบา ----------\n')

    const concrete = new Concrete();
    const wallConcrete = concrete.mixConcrete(1, 3, 0);
    const lintelBeamConcrete = concrete.mixConcrete(1, 1.5, 3);

    console.log(`ก่ออิฐมวลเบาด้วย${wallConcrete}`);
    console.log(`ทำคานและเสาทับหลังด้วย${lintelBeamConcrete}`);
    console.log(`ฉาบผนังด้วย${concrete}`);
    console.log(`ทาสีผนัง`);
    console.log('\n------------------------------------\n');
  }

  buildLightweightWall(): void {
    console.log('\n---------- ก่อกำแพงผนังเบา -----------\n')

    console.log(`ติดตั้งเหล็กโครงคร่าว`);
    console.log(`ติดตั้งตั้งแผ่นผนังเบา`);
    console.log(`ฉาบเก็บรอยต่อแผ่น`);
    console.log(`ทาสีผนัง`);
    console.log('\n------------------------------------\n');
  }
}

class Roof {
  private buildStructure(): void {
    console.log(`ขึ้นโครงหลังคา`);
  }

  buildTerracottaRoof(): void {
    console.log('\n------------ สร้างหลังคา -------------\n')

    this.buildStructure();
    console.log(`ปูหลังคาด้วยกระเบื้องดินเผา`);
    console.log('\n------------------------------------\n');
  }

  buildMetalSheetRoof(): void {
    console.log('\n------------ สร้างหลังคา -------------\n')

    this.buildStructure();
    console.log(`ปูหลังคาด้วยเมทัลชีท`);
    console.log('\n------------------------------------\n');
  }
}

class Tiles {
  installCeramicTiles(): void {
    console.log('\n------------- ปูกระเบื้อง --------------\n')

    console.log(`ตั้งระดับและกำหนดแนวในการปู`);
    console.log(`ปูกระเบื้อง`);
    console.log(`ยาแนว`);
    console.log('\n------------------------------------\n');
  }

  installVinylTiles(): void {
    console.log('\n------------ ปูกระเบื้องยาง ------------\n')
    console.log(`ตั้งระดับความสูงและกำหนดแนวในการปู`);
    console.log(`ทากาว`);
    console.log(`วางแผ่นกระเบื้องยาง`);
    console.log('\n------------------------------------\n');
  }

}

// + ------------ Facade ------------ + //
class HouseBuilder {
  private concrete: Concrete = new Concrete();
  private wall: Wall = new Wall();
  private roof: Roof = new Roof();
  private tiles: Tiles = new Tiles();

  buildHouse(wallType: String, roofType: String, tilesType: String): void {
    this.concrete.buildPole();
    this.concrete.buildBeam();
    this.concrete.buildFloor();

    switch (roofType) {
      case 'กระเบื้องดินเผา': this.roof.buildTerracottaRoof(); break;
      case 'เมทัลชีท': this.roof.buildMetalSheetRoof(); break;
    }

    switch (wallType) {
      case 'อิฐมอญ': this.wall.buildClayBrickWall(); break;
      case 'อิฐมวลเบา': this.wall.buildAACBlockWall(); break;
      case 'ผนังเบา': this.wall.buildLightweightWall(); break;
    }

    switch (tilesType) {
      case 'กระเบื้อง': this.tiles.installCeramicTiles(); break;
      case 'กระเบื้องยาง': this.tiles.installVinylTiles(); break;
    }
  }
}

// + ------------ Client ------------ + //
const house = new HouseBuilder();

console.log('\n======= อิฐมอญ, ดินเผา, กระเบื้อง =======\n');
house.buildHouse('อิฐมอญ', 'กระเบื้องดินเผา', 'กระเบื้อง');
console.log('\n=====================================\n');

console.log('\n==== อิฐมวลเบา, เมทัลชีท, กระเบื้องยาง ====\n');
house.buildHouse('อิฐมวลเบา', 'เมทัลชีท', 'กระเบื้องยาง');
console.log('\n======================================\n');

console.log('\n===== ผนังเบา, เมทัลชีท, กระเบื้องยาง =====\n');
house.buildHouse('ผนังเบา', 'เมทัลชีท', 'กระเบื้องยาง');
console.log('\n======================================\n');