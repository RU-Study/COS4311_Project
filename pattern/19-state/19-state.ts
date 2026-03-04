class Appliance {
  private name: string;
  private priority: number;
  private isOpen: boolean;

  constructor(name: string, priority: number) {
    this.name = name;
    this.priority = priority;
    this.isOpen = false;
  }

  getPriority(): number {
    return this.priority;
  }

  turnOn() {
    if (this.isOpen) return;

    this.isOpen = true;
    console.log(`เปิด${this.name}แล้ว...`);
  }

  turnOff() {
    if (!this.isOpen) return;

    this.isOpen = false;
    console.log(`ปิด${this.name}แล้ว...`);
  }
}

// + ------------------- Context --------------------- + //
class HospitalPowerManagement {
  private state: PowerState = new NormalState(this);
  private appliances: Appliance[] = [];

  changeState(state: PowerState) {
    this.state = state;
    this.powerDistribution();
  }
  
  mainPowerOutage() {
    this.state.mainPowerOutage();
  }
  
  mainPowerOutageRestored() {
    this.state.mainPowerOutageRestored();
  }
  
  backupPowerOutage(capacity: number) {
    this.state.backupPowerOutage(capacity);
  }
  
  backupPowerRestored(capacity: number) {
    this.state.backupPowerRestored(capacity);
  }

  allPowerOutage() {
    this.state.allPowerOutage();
  }

  powerDistribution() {
    this.state.powerDistribution();
  }

  addAppliance(appliance: Appliance) {
    this.appliances.push(appliance);
  }

  removeAppliance(appliance: Appliance) {
    const index = this.appliances.indexOf(appliance);
    
    if (index > -1) {
      this.appliances.splice(index, 1);
    }
  }

  getAppliances(): Appliance[] {
    return this.appliances;
  }
}

// + --------------------- State --------------------- + //
abstract class PowerState {
  protected hospital: HospitalPowerManagement;
  
  protected constructor(hospital: HospitalPowerManagement) {
    this.hospital = hospital;
  }

  abstract mainPowerOutage(): void;
  abstract mainPowerOutageRestored(): void;
  abstract backupPowerOutage(capacity: number): void;
  abstract backupPowerRestored(capacity: number): void;
  abstract allPowerOutage(): void;
  abstract powerDistribution(): void;
}

// + ----------------- Concrete State ---------------- + //
class NormalState extends PowerState {
  constructor(hospital: HospitalPowerManagement) {
    super(hospital);
  }

  mainPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้อง...');
    this.hospital.changeState(new EmergencyState(this.hospital));
  }

  mainPowerOutageRestored(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าทำงานปกติ...');
  }

  backupPowerOutage(capacity: number): void {
    if (capacity === -1) {
      console.log('ระบบไฟฟ้าสำรองชำรุด เตรียมดำเนินการซ่อมแซม...');
    } else {
      console.log(`ระบบไฟฟ้าสำรองเหลือพลังงาน ${capacity}%`);
    }
  }

  backupPowerRestored(capacity: number): void {
    console.log(`ระบบไฟฟ้าสำรองมีพลังงาน ${capacity}%`);
  }

  allPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้องและระบบไฟฟ้าสำรองชำรุด...');
    this.hospital.changeState(new FailedState(this.hospital));
  }

  powerDistribution(): void {
    console.log('\n-------------------- Normal State --------------------\n');
    // console.log('จ่ายไฟฟ้าให้กับอุปกรณ์ทั้งหมด...');
    
    this.hospital.getAppliances().forEach(appliance => {
      appliance.turnOn();
    });
  }
}

class EmergencyState extends PowerState {
  constructor(hospital: HospitalPowerManagement) {
    super(hospital);
  }

  mainPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้อง...');
  }

  mainPowerOutageRestored(): void {    
    console.log('ไฟ้ฟ้าจากการไฟฟ้าทำงานปกติ...');
    this.hospital.changeState(new NormalState(this.hospital));
  }

  backupPowerOutage(capacity: number): void {
    if (capacity === -1) {
      
      console.log('ระบบไฟฟ้าสำรองชำรุด');
      this.hospital.changeState(new FailedState(this.hospital));

    } else if (capacity <= 20) {
      
      console.log(`พลังงานของระบบไฟฟ้าสำรองเหลือ ${capacity}%`);
      this.hospital.changeState(new CriticalState(this.hospital));
    
    }
  }

  backupPowerRestored(capacity: number): void {
    console.log(`ระบบไฟฟ้าสำรองมีพลังงาน ${capacity}%`);
  }

  allPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้องและระบบไฟฟ้าสำรองชำรุด...');
    this.hospital.changeState(new FailedState(this.hospital));
  }

  powerDistribution(): void {
    console.log('\n------------------ Emergency State -------------------\n');
    // console.log('เริ่มยกเลิกการจ่ายไฟฟ้าให้กับอุปกรณ์ที่มีความสำคัญต่ำและจ่ายไฟฟ้าให้กับอุปกรณ์ที่มีความสำคัญสูง...');

    this.hospital.getAppliances().forEach(appliance => {
      if (appliance.getPriority() < 5) {
        appliance.turnOff();
      } else if (appliance.getPriority() >= 5) {
        appliance.turnOn();
      }
    });
  }
}

class CriticalState extends PowerState {
  constructor(hospital: HospitalPowerManagement) {
    super(hospital);
  }

  mainPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้อง...');
  }

  mainPowerOutageRestored(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าทำงานปกติ...');
    this.hospital.changeState(new NormalState(this.hospital));
  }

  backupPowerOutage(capacity: number): void {
    if (capacity <= 0) {
      console.log('ระบบไฟฟ้าสำรองชำรุด');

      this.hospital.changeState(new FailedState(this.hospital));
    }
  }

  backupPowerRestored(capacity: number): void {
    console.log(`ระบบไฟฟ้าสำรองมีพลังงาน ${capacity}%`);

    if (capacity > 20) {
      this.hospital.changeState(new EmergencyState(this.hospital));
    }
  }

  allPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้องและระบบไฟฟ้าสำรองชำรุด...');

    this.hospital.changeState(new FailedState(this.hospital));
  }

  powerDistribution(): void {
    
    console.log('\n------------------- Critical State -------------------\n');
    // console.log('เริ่มยกเลิกการจ่ายไฟฟ้าให้กับอุปกรณ์ที่มีความสำคัญปานกลางและจ่ายไฟฟ้าให้กับอุปกรณ์ที่มีความสำคัญสูง...');

    this.hospital.getAppliances().forEach(appliance => {
      if (appliance.getPriority() < 8) {
        appliance.turnOff();
      } else if (appliance.getPriority() >= 8) {
        appliance.turnOn();
      }
    });
  }
}

class FailedState extends PowerState {
  constructor(hospital: HospitalPowerManagement) {
    super(hospital);
  }

  mainPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้อง...');
  }

  mainPowerOutageRestored(): void {
    this.hospital.changeState(new NormalState(this.hospital));
    console.log('ไฟ้ฟ้าจากการไฟฟ้าทำงานปกติ...');
  }

  backupPowerOutage(capacity: number): void {
    console.log('ระบบไฟฟ้าสำรองไม่สามารถใช้งานได้...');
  }

  backupPowerRestored(capacity: number): void {
    console.log(`ระบบไฟฟ้าสำรองมีพลังงาน ${capacity}%`);

    if (capacity > 5) {
      this.hospital.changeState(new CriticalState(this.hospital));
    }
  }

  allPowerOutage(): void {
    console.log('ไฟ้ฟ้าจากการไฟฟ้าขัดข้องและระบบไฟฟ้าสำรองชำรุด...');
  }

  powerDistribution(): void {
    console.log('\n-------------------- Failed State --------------------\n');

    // console.log('ยกเลิกการจ่ายไฟฟ้าให้กับอุปกรณ์ทั้งหมด...');
    
    this.hospital.getAppliances().forEach(appliance => {
      appliance.turnOff();
    });
  }
}

// + -------------------- Client --------------------- + //
const hospital = new HospitalPowerManagement();

hospital.addAppliance(new Appliance('เครื่องช่วยหายใจ', 10));
hospital.addAppliance(new Appliance('เครื่องติดตามสัญญาณชีพ', 10));
hospital.addAppliance(new Appliance('ระบบภายในห้องผ่าตัด', 8));

hospital.addAppliance(new Appliance('เครื่อง X-Ray ', 7));
hospital.addAppliance(new Appliance('ระบบแสงสว่างในพื้นที่รักษา', 6));
hospital.addAppliance(new Appliance('ระบบคอมพิวเตอร์เวชระเบียน', 5));


hospital.addAppliance(new Appliance('ระบบปรับอากาศ', 4));
hospital.addAppliance(new Appliance('ระบบแสงสว่างในพื้นที่ทั้วไป', 3));
hospital.addAppliance(new Appliance('เครื่องใช้ไฟฟ้าทั้วไป', 0));

// --------------------------------------------------------------------------
hospital.powerDistribution();

console.log('\n------------------------------------------------------\n');
hospital.mainPowerOutage();

console.log('\n------------------------------------------------------\n');
hospital.backupPowerOutage(15);

console.log('\n------------------------------------------------------\n');
hospital.backupPowerOutage(0);

console.log('\n------------------------------------------------------\n');
hospital.backupPowerRestored(10);

console.log('\n------------------------------------------------------\n');
hospital.backupPowerRestored(50);

console.log('\n------------------------------------------------------\n');
hospital.mainPowerOutageRestored();

console.log('\n------------------------------------------------------\n');
hospital.allPowerOutage();

console.log('\n------------------------------------------------------\n');
hospital.mainPowerOutageRestored();

console.log('\n------------------------------------------------------\n');
hospital.backupPowerOutage(-1);

console.log('\n------------------------------------------------------');