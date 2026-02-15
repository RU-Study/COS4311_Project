// + ------------ Component ------------ + //
interface Administrative {
  getName(): string;
  getPopulation(): number;
}

// + ------------ Composite ------------ + //
class AdministrativeUnit implements Administrative {
  private name: string;
  private administrative: Administrative[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addAdministrative(administrative: Administrative): void {
    this.administrative.push(administrative);
  }

  getName(): string {
    const child = this.administrative.map((node: Administrative) => node.getName()).join(', ');

    return `\n\n${this.name} ประกอบด้วย: \n${child}`;
  }

  getPopulation(): number {
    let population = 0;

    this.administrative.forEach((node: Administrative) => {
      population += node.getPopulation();
    });

    return population;
  }
}

// + ------------ Leaf ------------ + //
class AdministrativeLeaf implements Administrative {
  private name: string;
  private population: number;

  constructor(name: string, population: number) {
    this.name = name;
    this.population = population;
  }

  getName(): string {
    return this.name;
  }

  getPopulation(): number {
    return this.population;
  }
}

// + ------------ Client ------------ + //
const bangKhunThian = new AdministrativeUnit('เขตบางขุนเทียน');

const thaKham = new AdministrativeUnit('แขวงท่าข้าม');
const khlongSam = new AdministrativeLeaf('ชุมชนคลองสาม', 300);
const khlongPhithayalongkorn = new AdministrativeLeaf('ชุมชนคลองพิทยาลงกรณ์', 250);

const samaeDam = new AdministrativeUnit('แขวงแสมดำ');
const chulaphong = new AdministrativeLeaf('ชุมชนจุลพงษ์', 550);
const soiNaiChiak = new AdministrativeLeaf('ชุมชนซอยนายเจียก', 350);

thaKham.addAdministrative(khlongSam);
thaKham.addAdministrative(khlongPhithayalongkorn);

samaeDam.addAdministrative(chulaphong);
samaeDam.addAdministrative(soiNaiChiak);

bangKhunThian.addAdministrative(thaKham);
bangKhunThian.addAdministrative(samaeDam);

console.log(bangKhunThian.getName());
console.log(`จำนวนประชากรทั้งหมด ${bangKhunThian.getPopulation()} คน`);