// + ------------ Component ------------ + //
interface Garden {
  getDetail(): string;
  maintain(): void;
}

class EnglishGarden implements Garden {
  getDetail(): string {
    return 'สวนสไตล์อังกฤษ ที่ประกอบด้วย';
  }

  maintain(): void {
    console.log('ทำการดูแลปรับปรุงสวน');
  }
}

// + ------------ Decorator ------------ + //
abstract class GardenDecorator implements Garden {
  protected garden: Garden;

  protected constructor(garden: Garden) {
    this.garden = garden;
  }

  abstract getDetail(): string;
  abstract maintain(): void;
}

class Flower extends GardenDecorator {
  private type: string;
  
  constructor(garden: Garden, type: string) {
    super(garden);
    this.type = type;
  }

  getDetail(): string {
    return `${this.garden.getDetail()} \n - ดอก${this.type}`;
  }

  maintain(): void {
    this.garden.maintain();
    console.log(`ทำการรดน้ำและใส่ปุ๋ยให้กับดอก${this.type}`);
  }
}

class Paving extends GardenDecorator {
  private material: string;

  constructor(garden: Garden, material: string) {
    super(garden);
    this.material = material;
  }

  getDetail(): string {
    return `${this.garden.getDetail()} \n - แผ่นพื้น${this.material}`;
  }

  maintain(): void {
    this.garden.maintain();
    console.log(`ทำการขัดทำความสะอาดแผ่นพื้น${this.material}`);
  }
}

// + ------------ Client ------------ + //
const garden = new EnglishGarden();
const gardenWithRose = new Flower(garden, 'กุหลาบ');
const gardenWithRoseDaisy = new Flower(gardenWithRose, 'เดซี่');
const gardenWithRoseDaisyHydrangea = new Flower(gardenWithRoseDaisy, 'ไฮเดรนเยีย');
const gardenWithRoseDaisyHydrangeaBrick = new Paving(gardenWithRoseDaisyHydrangea, 'อิฐมอญ');
const gardenWithRoseDaisyHydrangeaBrickGravel = new Paving(gardenWithRoseDaisyHydrangeaBrick, 'หินกรวด');

console.log(gardenWithRoseDaisyHydrangeaBrickGravel.getDetail());
console.log('\n------------------------------------\n');
gardenWithRoseDaisyHydrangeaBrickGravel.maintain();