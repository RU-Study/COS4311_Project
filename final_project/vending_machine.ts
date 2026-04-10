const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
import { ErrorMessage, MaintenanceHub, RestockHub, RestockMessage } from "./incident_hub";
import { ErrorPinkMilk, HotCocoa, HotEspresso, HotMilk, IcedAmericano, IcedCocoa, IcedEspresso, IcedLatte, MenuCreator, PinkMilk } from "./menu";
import { CashPayment, QRPayment } from "./payment";
import { Ingredient, VendingStock } from "./stock";

class MenuData {
  private menu: MenuCreator;
  private price: number;
  private isAvailable: boolean;

  constructor(menu: MenuCreator, price: number) {
    this.menu = menu;
    this.price = price;
    this.isAvailable = false;
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) throw new Error('กรุณาใส่ราคาที่มากกว่า 0');

    this.price = newPrice;
  }

  updateStatus(newStatus: boolean): void {
    this.isAvailable = newStatus;
  }

  getMenu(): MenuCreator {
    return this.menu;
  }

  getPrice(): number {
    return this.price;
  }

  getStatus(): boolean {
    return this.isAvailable;
  }
}

export class Order {
  private menu: MenuCreator;
  private price: number;

  constructor(menu: MenuCreator, price: number) {
    this.menu = menu;
    this.price = price;
  }

  getMenu(): MenuCreator {
    return this.menu;
  }

  getPrice(): number {
    return this.price;
  }
}

// + ---------------------------- Facade: Facade --------------------------- + //
export class VendingMachine {
  private machineId: number;
  private stock: VendingStock;
  private menu: MenuData[];
  private prepareQueue: Order[];
  private restockHub: RestockHub;
  private maintenanceHub: MaintenanceHub;
  private isAvailable: boolean;

  constructor(machineId: number) {
    this.machineId = machineId;
    this.stock = new VendingStock();
    this.menu = [];
    this.prepareQueue = [];
    this.restockHub = RestockHub.getInstance();
    this.maintenanceHub = MaintenanceHub.getInstance();
    this.isAvailable = true;

    // * เพิ่มเมนูเครื่องดื่มทั้งหมดลงในระบบ
    this.menu.push(new MenuData(new HotEspresso(), 35));
    this.menu.push(new MenuData(new IcedEspresso(), 45));
    this.menu.push(new MenuData(new IcedAmericano(), 45));
    this.menu.push(new MenuData(new IcedLatte(), 45));
    this.menu.push(new MenuData(new HotCocoa(), 40));
    this.menu.push(new MenuData(new IcedCocoa(), 50));
    this.menu.push(new MenuData(new HotMilk(), 25));
    this.menu.push(new MenuData(new PinkMilk(), 35));
    this.menu.push(new MenuData(new ErrorPinkMilk(), 1));

    // * เพิ่มสต็อกวัตถุดิบเริ่มต้น
    this.stock.updateStock(new Ingredient('น้ำแข็ง', 100));
    this.stock.updateStock(new Ingredient('น้ำ', 10000));
    this.stock.updateStock(new Ingredient('นม', 200));
    this.stock.updateStock(new Ingredient('กาแฟ', 1000));
    this.stock.updateStock(new Ingredient('น้ำเชื่อม', 1000));
    this.stock.updateStock(new Ingredient('โกโก้', 0));
    this.stock.updateStock(new Ingredient('น้ำแดง', 300));

    // * อัปเดตสถานะเมนูทั้งหมด
    this.stock.getStock().forEach(ingredient => this.updateMenu(ingredient.getName()));
  }

  async orderMenu(id: number): Promise<void> {
    if (!this.isAvailable) {
      console.error('\n เครื่องไม่พร้อมให้บริการชั่วคราว ขออภัยในความไม่สะดวก \n');
      return Promise.resolve();
    }

    if (id <= 0 || id > this.menu.length) {
      console.error('\n ไม่พบหมายเลขเมนูที่เลือก กรุณาเลือกเมนูใหม่ \n');
      return Promise.resolve();
    }

    // * ตรวจสอบวัตถุดิบและสถานะเมนู
    const menu = this.menu[id - 1]!;

    if (!menu.getStatus()) {
      console.error('\n เมนูที่เลือกไม่พร้อมให้บริการ กรุณาเลือกเมนูใหม่ \n');
      return Promise.resolve();
    }

    const recipes = menu.getMenu().getRecipes();

    recipes.forEach(recipe => {
      if (this.stock.checkStock(recipe.getName()) < recipe.getQuantity()) {
        console.error(`\n วัตถุดิบ ${recipe.getName()} ไม่เพียงพอ กรุณาเลือกเมนูใหม่ \n`);
        return Promise.resolve();
      }
    });

    console.log(`\n คุณเลือกเมนู ${menu.getMenu().getName()} ราคา ${menu.getPrice()} บาท \n`);

    // * เลือกวิธีการชำระเงิน
    const rl = readline.createInterface({ input, output });
    let method = 0;

    while (true) {
      const answer = await rl.question(' - กรุณาเลือกวิธีการชำระเงิน (1: เงินสด, 2: QR Code): ');
      method = parseInt(answer);

      if (method === 1 || method === 2) break;

      console.log('!! กรุณาเลือกวิธีการชำระเงินให้ถูกต้อง\n');
    }

    rl.close();

    // * ดำเนินการชำระเงิน
    const paymentProcess = method === 1 ? new CashPayment(menu.getPrice()) : new QRPayment(menu.getPrice());
    await paymentProcess.proceedPayment();

    // * ดำเนินการทำหักสต็อกวัตถุดิบและเตรียมเครื่องดื่ม
    recipes.forEach(recipe => {
      this.stock.updateStock(new Ingredient(recipe.getName(), 0 - recipe.getQuantity()));
      this.updateMenu(recipe.getName());
    });

    this.prepareQueue.push(new Order(menu.getMenu(), menu.getPrice()));

    if (this.prepareQueue.length === 1) {
      this.executeOrder();
    }

    return Promise.resolve();
  }

  executeOrder(): void {
    if (!this.isAvailable) {
      console.error('\n เครื่องไม่พร้อมให้บริการชั่วคราว ขออภัยในความไม่สะดวก \n');
      return;
    }

    if (this.prepareQueue.length === 0) return;

    const order = this.prepareQueue.shift()!;
    const menu = order.getMenu();

    setTimeout(() => {
      try {
        
        menu.prepareDrink();

        console.log('\n ------------------------------------------------------------ \n');
        console.log(`\n เมนู ${menu.getName()} ของคุณเสร็จเรียบร้อยแล้ว กรุณาหยิบเครื่องดื่มของคุณ \n`);
        console.log('\n ------------------------------------------------------------ \n');
      
        this.executeOrder();
      
      } catch (error) {
        const code = new Date().getTime();

        this.maintenanceHub.notify(new ErrorMessage(this.machineId, (error as Error).message, order, code));
        
        console.error(`\n !! เกิดข้อผิดพลาดในการเตรียมเครื่องดื่ม ท่านสามารถติดต่อเจ้าหน้าที่เพื่อขอเงินคืนได้ที่เบอร์ 02-345-6789 โดยแจ้งรหัส ${code} !! \n`);

        this.isAvailable = false;
      }
      
    }, 5000);
  }

  updateMenu(ingName: string): void {
    const currentQty = this.stock.checkStock(ingName);

    // * แจ้งเตือนเมื่อวัตถุดิบใกล้หมด
    if (ingName !== 'น้ำแข็ง' && currentQty < 100) {
      this.restockHub.notify(new RestockMessage(this.machineId, ingName));
    
    } else if (ingName === 'น้ำ' && currentQty < 2000) {
      
      this.restockHub.notify(new RestockMessage(this.machineId, ingName));
      
    } else if (ingName === 'น้ำแข็ง' && currentQty < 20) {

      const waterQty = this.stock.checkStock('น้ำ');
      const usedWater = (waterQty > 2000) ? 2000 : waterQty;
      const newIce = Math.trunc(usedWater / 20);

      this.stock.updateStock(new Ingredient('น้ำ', 0 - usedWater - (newIce * 20)));
      this.stock.updateStock(new Ingredient('น้ำแข็ง', newIce));

    }

    // * อัปเดตสถานะเมนู
    this.menu.forEach(menuData => {
      const recipes = menuData.getMenu().getRecipes();

      // ตรวจสอบว่าเมนูนี้ได้รับผลกระทบจากวัตถุดิบที่อัปเดตหรือไม่
      const isRelated = recipes.some(recipe => recipe.getName() === ingName);

      if (isRelated) {
        const isAllIngReady = recipes.every(recipe => {
          return this.stock.checkStock(recipe.getName()) >= recipe.getQuantity();
        });

        menuData.updateStatus(isAllIngReady);
      }
    });
  }

  async updateStock(): Promise<void> {
    const rl = readline.createInterface({ input, output });
    const stockLength = this.stock.getStock().length - 1;
    let ingIndex = -1;
    let addedQty = 0;

    console.log('\n ------------------------- เพิ่มวัตถุดิบ ------------------------- \n');

    while (true) {
      const answer = await rl.question(` หมายเลข (index 0-${stockLength}) ของวัตถุดิบที่ต้องการเพิ่ม: `);
      ingIndex = parseInt(answer);

      if (answer === 'exit') {
        rl.close();
        return;
      }

      if (!isNaN(ingIndex) && ingIndex >= 0 && ingIndex < this.stock.getStock().length) break; 

      console.log(`!! กรุณาใส่หมายเลข index ระหว่าง 0-${stockLength} \n`);
    }

    while (true) {
      const answer = await rl.question(' จำนวนที่ต้องการเพิ่ม: ');
      addedQty = parseFloat(answer);

      if (answer === 'exit') {
        rl.close();
        return;
      }

      if (!isNaN(addedQty) && addedQty > 0) break;

      console.log('!! กรุณาใส่จำนวนที่มากกว่า 0 \n');
    }

    rl.close();

    const ingName = this.stock.getStock()[ingIndex]!.getName();

    this.stock.updateStock(new Ingredient(ingName, addedQty));
    this.updateMenu(ingName);

    console.log(`\n เพิ่มวัตถุดิบ ${ingName} จำนวน ${addedQty} หน่วยเรียบร้อยแล้ว \n`);
    console.log('\n ------------------------------------------------------------ \n');
  }

  updateStatus(status: boolean): void {
    this.isAvailable = status;
  }

  showMenu(): void {
    if (!this.isAvailable) {
      console.error('\n เครื่องไม่พร้อมให้บริการชั่วคราว ขออภัยในความไม่สะดวก \n');
      return;
    }

    const table: any[] = [];

    this.menu.forEach((menuData, index) => {
      table.push({
        'หมายเลขเมนู': index + 1,
        'ชื่อเมนู': menuData.getMenu().getName(),
        'ราคา': `฿${menuData.getPrice()}`,
        'สถานะ': menuData.getStatus() ? 'พร้อมให้บริการ' : 'ไม่พร้อมให้บริการ'
      });
    });
    
    console.log('\n ---------------------- เมนูเครื่องดื่มทั้งหมด --------------------- \n');
    console.table(table);
    console.log('\n ------------------------------------------------------------ \n');
  }

  showStock(): void {
    const table: any[] = [];

    this.stock.getStock().forEach((ing: Ingredient, index: number) => {
      table.push({
        'index': index,
        'ชื่อวัตถุดิบ': ing.getName(),
        'จำนวนคงเหลือ': ing.getQuantity()
      });
    });

    console.log('\n ---------------------- สต็อกวัตถุดิบทั้งหมด --------------------- \n');
    console.table(table);
    console.log('\n ------------------------------------------------------------ \n');
  }
}