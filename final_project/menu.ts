import { Ingredient } from './stock';

// + ----------------------- Factory Method: Product ----------------------- + //
abstract class Menu {
  protected syrup: number;
  protected ice: number;
  protected step: number;

  protected constructor() {
    this.ice = 0;
    this.syrup = 0;
    this.step = 0;
  }

  abstract basePreparation(): void;
  abstract coreMixing(): void;
  abstract finalMixing(): void;

  addIce(ice: number): void {
    this.ice = ice;
  };

  addSyrup(syrup: number): void {
    this.syrup = syrup;
  };
}

// + ------------------- Factory Method: Concrete Product ------------------ + //
class Coffee extends Menu {
  private coffee: number;
  private water: number;
  private milk: number;

  constructor(coffee: number, water: number) {
    super();
    this.coffee = coffee;
    this.water = water;
    this.milk = 0;
  }

  addMilk(milk: number): void {
    this.milk = milk;
  }

  basePreparation(): void {
    const useWater = this.coffee * 2;
    
    this.water -= useWater;
    
    console.log('\n ------------------------------------------------------------ \n');

    console.log(` ${++this.step}. บดเมล็ดกาแฟปริมาณ ${this.coffee} กรัม`);
    console.log(` ${++this.step}. ต้มน้ำร้อนปริมาณ ${useWater} มิลลิลิตร`);
    console.log(` ${++this.step}. เทผงกาแฟและน้ำร้อนลงในถ้วยชง`);
  }

  coreMixing(): void {
    if (this.water > 0) {
      console.log(` ${++this.step}. เติมน้ำเย็นปริมาณ ${this.water} มิลลิลิตร`);
    }

    if (this.milk > 0) {
      console.log(` ${++this.step}. เติมนมปริมาณ ${this.milk} มิลลิลิตร`);
    }

    if (this.syrup > 0) {
      console.log(` ${++this.step}. เติมน้ำเชื่อมปริมาณ ${this.syrup} มิลลิลิตร`);
    }
  }

  finalMixing(): void {
    console.log(` ${++this.step}. คนส่วนผสมทุกอย่างให้เข้ากัน`);
    console.log(` ${++this.step}. เทกาแฟลงในแก้ว ${this.ice > 0 ? 'พลาสติก' : 'กระดาษ'}`);
    
    if (this.ice > 0) {
      console.log(` ${++this.step}. เติมน้ำแข็ง ${this.ice} ก้อน`);
    }

    console.log('\n ------------------------------------------------------------ \n');    
  }
}

class Milk extends Menu {
  private milk: number;
  private isMilkHeated: boolean;
  private coreIngredients: string;
  private coreQuantity: number;

  constructor(milk: number) {
    super();
    this.milk = milk;
    this.isMilkHeated = false;
    this.coreIngredients = '';
    this.coreQuantity = 0;
  }

  setHeatMilk(need: boolean): void {
    this.isMilkHeated = need;
  }

  addCore(core: string, qty: number): void {
    this.coreIngredients = core;
    this.coreQuantity = qty;
  }

  basePreparation(): void {
    console.log('\n ------------------------------------------------------------ \n');

    if (this.isMilkHeated) {
      console.log(` ${++this.step}. เทนมปริมาณ ${this.milk} มิลลิลิตรลงในถ้วยอุ่น`);
    } else {
      console.log(` ${++this.step}. เทนมปริมาณ ${this.milk} มิลลิลิตรลงในถ้วยชง`);
    }
  }

  coreMixing(): void {
    const name = this.coreIngredients;
    const qty = this.coreQuantity;
    const type = this.isMilkHeated ? 'อุ่น' : 'ชง';

    if (this.coreQuantity <= 0) return;

    console.log(` ${++this.step}. เท${name}ปริมาณ ${qty} หน่วยลงในถ้วย ${type}`);
    console.log(` ${++this.step}. คนส่วนผสมทุกอย่างให้เข้ากัน`);
  }

  finalMixing(): void {
    console.log(` ${++this.step}. เทนมลงในแก้ว ${this.ice > 0 ? 'พลาสติก' : 'กระดาษ'}`);
    
    if (this.ice > 0) {
      console.log(` ${++this.step}. เติมน้ำแข็ง ${this.ice} ก้อน`);
    }
  }
}

// + ----------------------- Factory Method: Creator ----------------------- + //
export abstract class MenuCreator {
  private name: string;
  private recipes: Ingredient[];

  constructor(name: string, recipes: Ingredient[]) {
    this.name = name;
    this.recipes = recipes;
  }

  updateIngredient(ing: Ingredient): void {
    const curIngredient = this.recipes.find((item) => item.getName() === ing.getName());

    if (!curIngredient) throw new Error('ไม่มีวัตถุดิบนี้ในสูตร');
    
    const newQty = curIngredient.getQuantity() + ing.getQuantity();

    curIngredient.setQuantity(newQty);
    
    return;
  }
  
  getName(): string {
    return this.name;
  }

  getRecipes(): Ingredient[] {
    return this.recipes;
  };

  prepareDrink(): Menu {
    try {
      const menu = this.createMenu();

      menu.basePreparation();
      menu.coreMixing();
      menu.finalMixing();

      return menu;
      
    } catch (error) {
      throw error;
    }
  };

  abstract createMenu(): Menu
}

// + ------------------- Factory Method: Concrete Creator ------------------ + //
export class HotEspresso extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('กาแฟ', 20),
      new Ingredient('น้ำ', 40),
    ];

    super('เอสเปรสโซร้อน', recipes);
  }

  createMenu(): Menu {
    const coffee = this.getRecipes().find((item) => item.getName() === 'กาแฟ');
    const water = this.getRecipes().find((item) => item.getName() === 'น้ำ');

    if (!coffee || !water) throw new Error('สูตรผิดพลาด');

    return new Coffee(coffee.getQuantity(), water.getQuantity());
  }
}

export class IcedEspresso extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('กาแฟ', 40),
      new Ingredient('น้ำ', 80),
      new Ingredient('น้ำเชื่อม', 10),
      new Ingredient('น้ำแข็ง', 8),
    ];

    super('เอสเปรสโซเย็น', recipes);
  }

  createMenu(): Menu {
    const coffee = this.getRecipes().find((item) => item.getName() === 'กาแฟ');
    const water = this.getRecipes().find((item) => item.getName() === 'น้ำ');
    const syrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อม');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');
    
    if (!coffee || !water || !syrup || !ice) throw new Error('สูตรผิดพลาด');

    const menu = new Coffee(coffee.getQuantity(), water.getQuantity());

    menu.addSyrup(syrup.getQuantity());
    menu.addIce(ice.getQuantity());
    
    return menu;
  }
}

export class IcedAmericano extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('กาแฟ', 40),
      new Ingredient('น้ำ', 220),
      new Ingredient('น้ำแข็ง', 8),
    ];

    super('อเมริกาโนเย็น', recipes);
  }

  createMenu(): Menu {
    const coffee = this.getRecipes().find((item) => item.getName() === 'กาแฟ');
    const water = this.getRecipes().find((item) => item.getName() === 'น้ำ');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');
    const syrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อม');

    if (!coffee || !water || !ice || !syrup) throw new Error('สูตรผิดพลาด');

    const menu = new Coffee(coffee.getQuantity(), water.getQuantity());
    menu.addIce(ice.getQuantity());
    menu.addSyrup(syrup.getQuantity());

    return menu;
  }
}

export class IcedLatte extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('กาแฟ', 40),
      new Ingredient('น้ำ', 80),
      new Ingredient('น้ำแข็ง', 8),
      new Ingredient('นม', 180),
      new Ingredient('น้ำเชื่อม', 10)
    ];

    super('ลาเต้เย็น', recipes);
  }

  createMenu(): Menu {
    const coffee = this.getRecipes().find((item) => item.getName() === 'กาแฟ');
    const water = this.getRecipes().find((item) => item.getName() === 'น้ำ');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');
    const syrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อม');

    if (!coffee || !water || !ice || !milk || !syrup) throw new Error('สูตรผิดพลาด');

    const menu = new Coffee(coffee.getQuantity(), water.getQuantity());

    menu.addIce(ice.getQuantity());
    menu.addMilk(milk.getQuantity());
    menu.addSyrup(syrup.getQuantity());

    return menu;
  }
}

export class HotCocoa extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('โกโก้', 15),
      new Ingredient('นม', 230),
      new Ingredient('น้ำเชื่อม', 15)
    ];

    super('โกโก้ร้อน', recipes);
  }

  createMenu(): Menu {
    const cocoa = this.getRecipes().find((item) => item.getName() === 'โกโก้');
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');
    const syrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อม');

    if (!cocoa || !milk || !syrup) throw new Error('สูตรผิดพลาด');

    const menu = new Milk(milk.getQuantity());

    menu.setHeatMilk(true);
    menu.addCore(cocoa.getName(), cocoa.getQuantity());
    menu.addSyrup(syrup.getQuantity());

    return menu;
  }
}

export class IcedCocoa extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('โกโก้', 15),
      new Ingredient('นม', 200),
      new Ingredient('น้ำเชื่อม', 10),
      new Ingredient('น้ำแข็ง', 6)
    ];
    super('โกโก้เย็น', recipes);
  }

  createMenu(): Menu {
    const cocoa = this.getRecipes().find((item) => item.getName() === 'โกโก้');
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');
    const syrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อม');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');

    if (!cocoa || !milk || !syrup || !ice) throw new Error('สูตรผิดพลาด');

    const menu = new Milk(milk.getQuantity());

    menu.addCore(cocoa.getName(), cocoa.getQuantity());
    menu.addSyrup(syrup.getQuantity());
    menu.addIce(ice.getQuantity());

    return menu;
  }
}

export class HotMilk extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('นม', 200)
    ];

    super('นมร้อน', recipes);
  }

  createMenu(): Menu {
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');

    if (!milk) throw new Error('สูตรผิดพลาด');

    const menu = new Milk(milk.getQuantity());
    
    menu.setHeatMilk(true);

    return menu;
  }
}

export class PinkMilk extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('นม', 150),
      new Ingredient('น้ำแดง', 40),
      new Ingredient('น้ำแข็ง', 6)
    ];
    super('นมชมพู', recipes);
  }

  createMenu(): Menu {
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');
    const redSyrup = this.getRecipes().find((item) => item.getName() === 'น้ำแดง');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');

    if (!milk || !redSyrup || !ice) throw new Error('สูตรผิดพลาด');

    const menu = new Milk(milk.getQuantity());

    menu.addCore(redSyrup.getName(), redSyrup.getQuantity());
    menu.addIce(ice.getQuantity());
    
    return menu;
  }
}

export class ErrorPinkMilk extends MenuCreator {
  constructor() {
    const recipes = [
      new Ingredient('นม', 150),
      new Ingredient('น้ำแดง', 40),
      new Ingredient('น้ำแข็ง', 6)
    ];
    super('นมชมพูเสีย', recipes);
  }

  createMenu(): Menu {    
    const milk = this.getRecipes().find((item) => item.getName() === 'นม');
    const redSyrup = this.getRecipes().find((item) => item.getName() === 'น้ำเชื่อมแดง');
    const ice = this.getRecipes().find((item) => item.getName() === 'น้ำแข็ง');

    if (!milk || !redSyrup || !ice) throw new Error('สูตรผิดพลาด');

    const menu = new Milk(milk.getQuantity());

    menu.addCore(redSyrup.getName(), redSyrup.getQuantity());
    menu.addIce(ice.getQuantity());
    
    return menu;
  }
}