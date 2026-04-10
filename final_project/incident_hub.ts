import { Order } from './vending_machine';

class RestockQueue {
  private machineId: number;
  private ingredient: string[];

  constructor(machineId: number) {
    this.machineId = machineId;
    this.ingredient = [];
  }

  addIngredient(ing: string) {
    this.ingredient.push(ing);
  }

  getMachineId(): number {
    return this.machineId;
  }

  getIngredient(): string[] {
    return this.ingredient;
  }
}

class MaintenanceQueue {
  private machineId: number;
  private errorMessage: string;

  constructor(machineId: number, msg: string) {
    this.machineId = machineId;
    this.errorMessage = msg;
  }

  getMachineId(): number {
    return this.machineId;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}

class ErrorRecord {
  private message: ErrorMessage;
  private timestamp: number;
  private isClear: boolean;

  constructor(msg: ErrorMessage) {
    this.message = msg;
    this.timestamp = Date.now();
    this.isClear = false;
  }

  clear(): void {
    this.isClear = true;
  }
  
  getMessage(): ErrorMessage {
    return this.message;
  }

  getTime(): number {
    return this.timestamp;
  }

  getStatus(): boolean {
    return this.isClear;
  }
}

// * Message * //
export class RestockMessage {
  machineId: number;
  ingredientName: string;

  constructor(machineId: number, ingredientName: string) {
    this.machineId = machineId;
    this.ingredientName = ingredientName;
  }
}

export class ErrorMessage {
  machineId: number;
  message: string;
  amount: number;
  menuName: string;
  code: number;

  constructor(mId: number, msg: string, order: Order, code: number) {
    this.machineId = mId;
    this.message = msg;
    this.amount = order.getPrice();
    this.menuName = order.getMenu().getName();
    this.code = code;
  }
}

// + ------------------------- Observer: Observer -------------------------- + //
abstract class Employee {
  protected id: string;
  protected responsible: Set<number>;

  constructor(id: string) {
    this.id = id;
    this.responsible = new Set();
  }

  addResponsible(macId: number): void {
    this.responsible.add(macId);
  }

  removeResponsible(macId: number): void {
    this.responsible.delete(macId);
  }

  isResponsible(macId: number): boolean {
    return this.responsible.has(macId);
  }

  abstract update<T>(data: T): void;
}

// + --------------------- Observer: Concrete Observer --------------------- + //
export class Restocker extends Employee {
  private queue: RestockQueue[];

  constructor(id: string) {
    super(id);
    this.queue = [];
  }

  addQueue(macId: number, ing: string): void {
    let restockQueue = this.queue.find(queue => queue.getMachineId() === macId);

    if (!restockQueue) {
      restockQueue = new RestockQueue(macId);
      
      this.queue.push(restockQueue);
    }

    restockQueue.addIngredient(ing);
  }

  restock(): void {
    console.log('\n ---------------------- พนักงานเติมวัตถุดิบ ----------------------- \n');
    console.log(` - พนักงาน ${this.id} กำลังดำเนินการเข้าเติมวัตถุดิบของเครื่อง`);

    this.queue.forEach(queue => {
      console.log(`\n   - หมายเลข ${queue.getMachineId()} >> วัตถุดิบที่ต้องเติม: `);
      
      queue.getIngredient().forEach(ing => console.log(`     + ${ing}`));
    });

    this.queue = [];
    
    console.log('\n ------------------------------------------------------------ \n');
  }

  update<T>(data: T): void {
    
    if (!(data instanceof RestockMessage)) return;
    
    const { machineId, ingredientName } = data;

    if (!this.isResponsible(machineId)) return;

    console.log(`\n -------------------- Restocker >> ${this.id} --------------------- \n`);
    console.log(` - วัตถุดิบ ${ingredientName} ของเครื่องหมายเลข ${machineId} หมดแล้ว \n`);
    console.log('\n ------------------------------------------------------------ \n');

    this.addQueue(machineId, ingredientName);
  }
}

export class CallCenter extends Employee {
  private static record: ErrorRecord[] = [];

  constructor(id: string) {
    super(id);
  }

  showRecord(): void {
    console.log('\n ---------------------- ประวัติการคืนเงิน ------------------------ \n');

    CallCenter.record.forEach(record => {
      const { machineId, message, amount, menuName, code } = record.getMessage();
      console.log(` - เครื่องหมายเลข ${machineId} พบปัญหา: ${message} [Code: ${code}]`);
      console.log(`   + รายการที่คืนเงิน: ${menuName} จำนวน ${amount} บาท`);
      console.log(`   + เวลาที่เกิดเหตุการณ์: ${new Date(record.getTime()).toLocaleString()}`);
      console.log(`   + สถานะ: ${record.getStatus() ? 'คืนแล้ว' : 'ยังไม่คืน'}\n`);
    });

    console.log('\n ------------------------------------------------------------ \n');
  }

  refund(index: number): void {
    if (index < 0 || index >= CallCenter.record.length) {
      console.error('ไม่สามารถคืนเงินได้: index ไม่ถูกต้อง');
      return;
    }

    const refundedRecord = CallCenter.record[index]!;
    const name = refundedRecord.getMessage().menuName;
    const amount = refundedRecord.getMessage().amount;

    console.log(`\n ------------------- Call Center >> ${this.id} -------------------- \n`);
    console.log(` - คืนเงินสำหรับรายการ: ${name} จำนวน ${amount} บาท \n`);
    console.log('\n ------------------------------------------------------------ \n');

    refundedRecord.clear();
  }

  update<T>(data: T): void {
    if (!(data instanceof ErrorMessage)) return;

    const { machineId, message, code } = data;

    if (!this.isResponsible(machineId)) return;

    console.log(`\n ------------------- Call Center >> ${this.id} -------------------- \n`);
    console.log(` - เครื่องหมายเลข ${machineId} พบปัญหา: ${message} [Code: ${code}] \n`);
    console.log('\n ------------------------------------------------------------ \n');

    const index = CallCenter.record.findIndex(record => record.getMessage().code === code);

    if (index !== -1) return;

    CallCenter.record.push(new ErrorRecord(data));
  }
}

export class SystemMonitor extends Employee {
  constructor(id: string) {
    super(id);
  }

  update<T>(data: T): void {
    if (data instanceof RestockMessage) {
      const { machineId, ingredientName } = data;

      if (!this.isResponsible(machineId)) return;

      console.log(`\n ------------------- System Monitor >> ${this.id} ------------------- \n`);
      console.log(` - วัตถุดิบ ${ingredientName} ของเครื่องหมายเลข ${machineId} หมดแล้ว \n`);
      console.log('\n ------------------------------------------------------------ \n');
    } else if (data instanceof ErrorMessage) {
      const { machineId, message } = data;

      if (!this.isResponsible(machineId)) return;

      console.log(`\n ------------------- System Monitor >> ${this.id} ------------------- \n`);
      console.log(` - เครื่องหมายเลข ${machineId} พบปัญหา: ${message} \n`);
      console.log('\n ------------------------------------------------------------ \n');
    }
  }
}

export class Maintainer extends Employee {
  private queue: MaintenanceQueue[];

  constructor(id: string) {
    super(id);
    this.queue = [];
  }

  addQueue(macId: number, msg: string): void {
    this.queue.push(new MaintenanceQueue(macId, msg));

    console.log('\n ---------------------- พนักงานซ่อมบำรุง ----------------------- \n');
    console.log(` - เพิ่มเครื่องหมายเลข ${macId} เข้าในคิวการซ่อมบำรุงของพนักงาน ${this.id} แล้ว \n`);
    console.log('\n ------------------------------------------------------------ \n');
  }

  maintenance(): void {
    console.log('\n ---------------------- พนักงานซ่อมบำรุง ----------------------- \n');
    console.log(` - พนักงาน ${this.id} กำลังดำเนินการเข้าซ่อมเครื่อง`);

    this.queue.forEach(queue => console.log(`   - หมายเลข ${queue.getMachineId()} >> ปัญหา: ${queue.getErrorMessage()}`));
    this.queue = [];
    
    console.log('\n ------------------------------------------------------------ \n');
  }

  update<T>(data: T): void {
    if (!(data instanceof ErrorMessage)) return;

    const { machineId, message } = data;

    if (!this.isResponsible(machineId)) return;

    console.log(`\n ------------------- Maintenance >> ${this.id} -------------------- \n`);
    console.log(` - เครื่องหมายเลข ${machineId} พบปัญหา: ${message} \n`);
    console.log('\n ------------------------------------------------------------ \n');

    this.addQueue(machineId, message);
  }
}

// + ------------------------- Observer: Publisher ------------------------- + //
abstract class Publisher<T> {
  protected observers: Employee[] = [];

  subscribe(observer: Employee): void {
    this.observers.push(observer);
  }

  unSubscribe(observer: Employee): void {
    const index = this.observers.indexOf(observer);

    if (index === -1) throw new Error('พนักงานคนดังกล่าวไม่ได้สมัครรับการแจ้งเตือน');

    this.observers.splice(index, 1);
  }

  abstract notify(data: T): void;
}

// + --------------------- Observer: Concrete Publisher -------------------- + //
export class RestockHub extends Publisher<RestockMessage> {
  private static instance: RestockHub;
  
  private constructor() {
    super();
  }

  static getInstance(): RestockHub {
    if (!RestockHub.instance) {
      RestockHub.instance = new RestockHub();
    }

    return RestockHub.instance;
  }

  notify(data: RestockMessage): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

export class MaintenanceHub extends Publisher<ErrorMessage> {
  private static instance: MaintenanceHub;
  
  private constructor() {
    super();
  }

  static getInstance(): MaintenanceHub {
    if (!MaintenanceHub.instance) {
      MaintenanceHub.instance = new MaintenanceHub();
    }

    return MaintenanceHub.instance;
  }

  notify(data: ErrorMessage): void {
    this.observers.forEach(observer => observer.update(data));
  }
}