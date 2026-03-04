// + ------------------ Component -------------------- + //
abstract class Administrative {
  protected name: string;
  protected level: number;

  constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }

  getName(): string {
    return this.name;
  }

  getLevel(): number {
    return this.level;
  }

  abstract getPopulation(): number;
}

// + -------- Concrete Collection / Composite / Context -------- + //
class AdministrativeUnit extends Administrative implements AdministrativeCollection {
  private administrative: Administrative[];

  constructor(name: string, level: number) {
    super(name, level);

    this.administrative = [];
  } 

  addAdministrative(administrative: Administrative) {
    this.administrative.push(administrative);
  }

  getAdministrative(): Administrative[] {
    return this.administrative;
  }

  createDFSIterator(): TreeIterator {
    return new DFSIterator(this);
  }

  createBFSIterator(): TreeIterator {
    return new BFSIterator(this);
  }

  getPopulation(): number {
    return this.action(new PopulationStrategy());
  }

  action<T>(strategy: Strategy<T>): T {
    return strategy.process(this);
  }
}

// + --------------------- Leaf ---------------------- + //
class AdministrativeLeaf extends Administrative {
  private population: number;

  constructor(name: string, level: number, population: number) {
    super(name, level);

    this.population = population;
  }

  getPopulation(): number {
    return this.population;
  }
}

// + ------------------ Collection ------------------- + //
interface AdministrativeCollection {
  createDFSIterator(): TreeIterator;
  createBFSIterator(): TreeIterator;
}

// + --------------- Concrete Iterator --------------- + //
interface TreeIterator {
  hasMore(): boolean;
  getNext(): Administrative;
}

// + --------------- Concrete Iterator --------------- + //
class DFSIterator implements TreeIterator {
  private stack: Administrative[];
  private top: number;

  constructor(root: AdministrativeUnit) {
    this.stack = [];
    this.top = -1;

    this.push(root);
  }

  private push(administrative: Administrative) {
    this.stack.push(administrative);
    this.top++;
  }

  private pop(): Administrative {
    if (this.hasMore()) {
      const administrative = this.stack[this.top]!;
      
      this.stack.pop();
      this.top--;

      return administrative;
    }

    throw new Error("Stack is empty");
  }

  hasMore(): boolean {
    return this.top >= 0;
  }

  getNext(): Administrative {
    const administrative = this.pop();

    if (administrative instanceof AdministrativeUnit) {
      const children = administrative.getAdministrative();

      for (let i = children.length - 1; i >= 0; i--) {
        this.push(children[i]!);
      }
    }

    return administrative;
  }
}

class BFSIterator implements TreeIterator {
  private queue: Administrative[];
  private front: number;
  private rear: number;

  constructor(root: AdministrativeUnit) {
    this.queue = [];
    this.front = 0;
    this.rear = -1;

    this.insert(root);
  }

  private insert(administrative: Administrative) {
    this.queue.push(administrative);
    this.rear++;
  }

  private delete(): Administrative {
    if (this.hasMore()) {
      const administrative = this.queue[this.front]!;

      this.front++;

      return administrative;
    }

    throw new Error("Queue is empty");
  }
  
  hasMore(): boolean {
    return this.front <= this.rear;
  }

  getNext(): Administrative {
    const administrative = this.delete();
    
    if (administrative instanceof AdministrativeUnit) {
      const administrativeUnit = administrative.getAdministrative();

      for (const administrative of administrativeUnit) {
        this.insert(administrative);
      }
    }

    return administrative;
  }
}

// + ------------------- Strategy -------------------- + //
interface Strategy<T> {
  process(unit: AdministrativeUnit): T;
}

// + --------------- Concrete Strategy --------------- + //
class SearchStrategy implements Strategy<Administrative> {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }

  process(unit: AdministrativeUnit): Administrative {
    const iterator = unit.createBFSIterator();

    while (iterator.hasMore()) {
      const administrative = iterator.getNext();

      if (administrative.getName() === this.name) {
        return administrative;
      }
    }

    throw new Error(`ไม่พบข้อมูลพื้นที่ที่ชื่อ ${this.name}`);
    
  }
}

class FilterStrategy implements Strategy<Administrative[]> {
  private level: number;

  constructor(level: number) {
    this.level = level;
  }

  setLevel(level: number) {
    this.level = level;
  }

  process(unit: AdministrativeUnit): Administrative[] {
    const iterator = unit.createBFSIterator();
    const administrative: Administrative[] = [];

    while (iterator.hasMore()) {
      const current = iterator.getNext();

      if (current.getLevel() === this.level) {
        administrative.push(current);
      }
    }

    return administrative;
  }
}

class PopulationStrategy implements Strategy<number> {
  process(unit: AdministrativeUnit): number {
    const iterator = unit.createDFSIterator();

    let totalPopulation = 0;

    while (iterator.hasMore()) {
      const current = iterator.getNext();

      if (current instanceof AdministrativeLeaf) {
        totalPopulation += current.getPopulation();
      }
    }

    return totalPopulation;
  }
}

class PrintStrategy implements Strategy<void> {
  process(unit: AdministrativeUnit): void {
    const iterator = unit.createDFSIterator();

    let name = ``;

    while (iterator.hasMore()) {
      
      const administrative = iterator.getNext();
      const level = administrative.getLevel();
      const administrativeName = administrative.getName();
      const prefix = ' '.repeat(level * 2);

      name += `\n${prefix}- ${administrativeName}`;
    }

    console.log(name);
  }
}

// + -------------------- Client --------------------- + //
const bangKhunThian = new AdministrativeUnit('เขตบางขุนเทียน', 2);

const thaKham = new AdministrativeUnit('แขวงท่าข้าม', 3);
const khlongSam = new AdministrativeLeaf('ชุมชนคลองสาม', 4, 300);
const khlongPhithayalongkorn = new AdministrativeLeaf('ชุมชนคลองพิทยาลงกรณ์', 4, 250);

const samaeDam = new AdministrativeUnit('แขวงแสมดำ', 3);
const chulaphong = new AdministrativeLeaf('ชุมชนจุลพงษ์', 4, 550);
const soiNaiChiak = new AdministrativeLeaf('ชุมชนซอยนายเจียก', 4, 350);

thaKham.addAdministrative(khlongSam);
thaKham.addAdministrative(khlongPhithayalongkorn);

samaeDam.addAdministrative(chulaphong);
samaeDam.addAdministrative(soiNaiChiak);

bangKhunThian.addAdministrative(thaKham);
bangKhunThian.addAdministrative(samaeDam);

console.log('----------------------------------------');

console.log('ข้อมูลพื้นที่ทั้งหมด');
bangKhunThian.action(new PrintStrategy());
console.log('\n----------------------------------------');


console.log(`\nจำนวนประชากรทั้งหมด ${bangKhunThian.action(new PopulationStrategy())} คน`);
console.log('\n----------------------------------------');

const filterStrategy = new FilterStrategy(3);

console.log(`\nข้อมูลแขวงทั้งหมด:`);

for (const administrative of bangKhunThian.action(filterStrategy)) {
  console.log(`- ${administrative.getName()} (${administrative.getPopulation()} คน)`);
}
console.log('\n----------------------------------------');

const searchStrategy = new SearchStrategy('');

console.log(`\nค้นหาข้อมูลพื้นที่:`);

try {
  searchStrategy.setName('ชุมชนจุลพงษ์');

  let result = bangKhunThian.action(searchStrategy);
  console.log(`${result.getName()} (${result.getPopulation()} คน)`);
  
  searchStrategy.setName('แขวง A');
  result = bangKhunThian.action(searchStrategy);
  console.log(`${result.getName()} (${result.getPopulation()} คน)`);

} catch (error) {

  console.error(error);

}

console.log('\n----------------------------------------');
