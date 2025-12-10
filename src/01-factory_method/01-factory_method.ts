interface Building {
  costEstimation(): void;
  construction(): void;
  inspection(): void;
}

class ConcreteHouse implements Building {
  costEstimation(): void {
    console.log("ดำเนินการประเมิณค่าใช้จ่ายในการสร้างบ้านคอนกรีต");
  }

  construction(): void {
    console.log("ดำเนินการก่อสร้างบ้านคอนกรีต");
  }

  inspection(): void {
    console.log("ดำเนินการตรวจรับการก่อสร้างบ้านคอนกรีต");
  }
}

class KnockdownHouse implements Building {
  costEstimation(): void {
    console.log("ดำเนินการประเมิณค่าใช้จ่ายในการสร้างบ้านน็อคดาวน์");
  }

  construction(): void {
    console.log("ดำเนินการก่อสร้างบ้านน็อคดาวน์");
  }

  inspection(): void {
    console.log("ดำเนินการตรวจรับการก่อสร้างบ้านน็อคดาวน์");
  }
}

class WoodenHouse implements Building {
  costEstimation(): void {
    console.log("ดำเนินการประเมิณค่าใช้จ่ายในการสร้างบ้านไม้");
  }

  construction(): void {
    console.log("ดำเนินการก่อสร้างบ้านไม้");
  }

  inspection(): void {
    console.log("ดำเนินการตรวจรับการก่อสร้างบ้านไม้");
  }
}

abstract class ConstructionCompany {
  abstract getBuilding(): Building;
  public createBuilding(): void {
    const building = this.getBuilding();

    building.costEstimation();
    building.construction();
    building.inspection();
  }
}

class ConcreteHouseCompany extends ConstructionCompany {
  getBuilding(): Building {
    return new ConcreteHouse();
  }
}

class KnockdownHouseCompany extends ConstructionCompany {
  getBuilding(): Building {
    return new KnockdownHouse();
  }
}

class WoodenHouseCompany extends ConstructionCompany {
  getBuilding(): Building {
    return new WoodenHouse();
  } 
}

function clientCode(constructionCompany: ConstructionCompany) {
  constructionCompany.createBuilding();
}

// + สร้างบ้านคอนกรีต
let building = new ConcreteHouseCompany();

console.log("\n------------------------------\n");
console.log("สร้างบ้านคอนกรีต");
clientCode(building);

// + สร้างบ้านน็อคดาวน์
building = new KnockdownHouseCompany();

console.log("\n------------------------------\n");
console.log("สร้างบ้านน็อคดาวน์");
clientCode(building);

// + สร้างบ้านไม้
building = new WoodenHouseCompany();

console.log("\n------------------------------\n");
console.log("สร้างบ้านไม้");
clientCode(building);

console.log("\n------------------------------\n");