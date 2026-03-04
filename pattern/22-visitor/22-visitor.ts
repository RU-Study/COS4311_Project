// + ------------------- Element --------------------- + //
abstract class Fruit {
  private variety: string;
  private count: number;

  protected constructor(variety: string) {
    this.variety = variety;
    this.count = 0;
  }

  getVariety(): string {
    return this.variety;
  }

  setCount(count: number) {
    this.count = count;
  }
  
  getCount(): number {
    return this.count;
  }

  abstract accept(visitor: Visitor): void;
}

// + --------------- Concrete Element ---------------- + //
class Mango extends Fruit {
  constructor(variety: string) {
    super(variety);
  }

  accept(visitor: Visitor) {
    visitor.visitMango(this);
  }
}

class Durian extends Fruit {
  constructor(variety: string) {
    super(variety);
  }

  accept(visitor: Visitor) {
    visitor.visitDurian(this);
  }
}

class Banana extends Fruit {
  constructor(variety: string) {
    super(variety);
  }

  accept(visitor: Visitor) {
    visitor.visitBanana(this);
  }
}

class Grape extends Fruit {
  constructor(variety: string) {
    super(variety);
  }

  accept(visitor: Visitor) {
    visitor.visitGrape(this);
  }
}

// + ------------------- Visitor --------------------- + //
interface Visitor {
  visitMango(fruit: Mango): void;
  visitDurian(fruit: Durian): void;
  visitBanana(fruit: Banana): void;
  visitGrape(fruit: Grape): void;
}

// + ---------------- Concrete Visitor --------------- + //
class WateringVisitor implements Visitor {
  visitMango(fruit: Mango) {
    console.log(`รดน้ำต้นมะม่วง${fruit.getVariety()}แล้ว...`);
    fruit.setCount(fruit.getCount() + 15);
  };

  visitDurian(fruit: Durian) {
    console.log(`รดน้ำต้นทุเรียน${fruit.getVariety()}แล้ว...`);
      fruit.setCount(fruit.getCount() + 5);
  };

  visitBanana(fruit: Banana) {
    console.log(`รดน้ำต้นกล้วย${fruit.getVariety()}แล้ว...`);
    fruit.setCount(fruit.getCount() + 10);
  };

  visitGrape(fruit: Grape) {
    console.log(`รดน้ำต้นองุ่น${fruit.getVariety()}แล้ว...`);
    fruit.setCount(fruit.getCount() + 8);
  };
}

class HarvestVisitor implements Visitor {
  visitMango(fruit: Mango) {
    const mangoCount = fruit.getCount();

    if (mangoCount >= 100) {
      console.log(`เก็บเกี่ยวผลมะม่วง ${fruit.getVariety()} จำนวน ${fruit.getCount()} ผล...`);
    } else {
      console.log(`ไม่สามารถเก็บเกี่ยวผลมะม่วง ${fruit.getVariety()} ได้ เนื่องจากมีผลน้อยกว่าเกณฑ์ที่กำหนด...`);
    }
  };
  
  visitDurian(fruit: Durian) {
    const durianCount = fruit.getCount();

    if (durianCount >= 30) {
      console.log(`เก็บเกี่ยวผลทุเรียน ${fruit.getVariety()} จำนวน ${fruit.getCount()} ผล...`);
    } else {
      console.log(`ไม่สามารถเก็บเกี่ยวผลทุเรียน ${fruit.getVariety()} ได้ เนื่องจากมีผลน้อยกว่าเกณฑ์ที่กำหนด...`);
    }
  };
  
  visitBanana(fruit: Banana) {
    const bananaCount = fruit.getCount();

    if (bananaCount >= 50) {
      console.log(`เก็บเกี่ยวผลกล้วย ${fruit.getVariety()} จำนวน ${fruit.getCount()} ผล...`);
    } else {
      console.log(`ไม่สามารถเก็บเกี่ยวผลกล้วย ${fruit.getVariety()} ได้ เนื่องจากมีผลน้อยกว่าเกณฑ์ที่กำหนด...`);
    }
  };
  
  visitGrape(fruit: Grape) {
    const grapeCount = fruit.getCount();

    if (grapeCount >= 20) {
      console.log(`เก็บเกี่ยวผลองุ่น ${fruit.getVariety()} จำนวน ${fruit.getCount()} ผล...`);
    } else {
      console.log(`ไม่สามารถเก็บเกี่ยวผลองุ่น ${fruit.getVariety()} ได้ เนื่องจากมีผลน้อยกว่าเกณฑ์ที่กำหนด...`);
    }
  };
}

// + -------------------- Client --------------------- + //
class Orchard {
  private fruits: Fruit[] = [];

  addFruit(fruit: Fruit): void {
    this.fruits.push(fruit);
  }

  watering() {
    const visitor = new WateringVisitor();

    this.fruits.forEach(fruit => fruit.accept(visitor));
  }

  harvest() {
    const visitor = new HarvestVisitor();

    this.fruits.forEach(fruit => fruit.accept(visitor));
  }

  show() {
    this.fruits.forEach(fruit => {
      let name = '';
  
      switch (fruit.constructor.name) {
        case 'Mango': name = 'มะม่วง'; break;
        case 'Durian': name = 'ทุเรียน'; break;
        case 'Banana': name = 'กล้วย'; break;
        case 'Grape': name = 'องุ่น'; break;
      }

      console.log(`${name}${fruit.getVariety()}: ${fruit.getCount()} ผล`);
    });

  }
}

const abcOrchard = new Orchard();

abcOrchard.addFruit(new Mango('น้ำดอกไม้'));
abcOrchard.addFruit(new Mango('เขียวเสวย'));

abcOrchard.addFruit(new Durian('หมอนทอง'));
abcOrchard.addFruit(new Durian('ก้านยาว'));

abcOrchard.addFruit(new Banana('น้ำว้า'));
abcOrchard.addFruit(new Banana('หอม'));

abcOrchard.addFruit(new Grape('แบล็คโอปอล'));
abcOrchard.addFruit(new Grape('ไซมัสคัส'));

console.log('----------------------------------------\n');
abcOrchard.watering();

console.log('\n----------------------------------------\n');
abcOrchard.harvest();

console.log('\n----------------------------------------\n');

for (let i = 0; i < 4; i++) {
  console.log('Watering Round ' + (i + 1) + '\n');
  
  abcOrchard.watering();
  console.log('\n----------------------------------------\n');
}

abcOrchard.show();
console.log('\n----------------------------------------\n');

abcOrchard.harvest();
console.log('\n----------------------------------------\n');

abcOrchard.watering();
console.log('\n----------------------------------------\n');

abcOrchard.harvest();
console.log('\n----------------------------------------');
