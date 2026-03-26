// + ------------------- Mediator ------------------- + //
interface SkyTrainMediator {
  notify(sender: SkyTrainSystem, event: string): void;
}

// + --------------- Concrete Mediator ---------------- + //
class PositionRecord {
  private train: Train;
  private route: Route;

  constructor(train: Train, route: Route) {
    this.train = train;
    this.route = route;
  }

  getTrain(): Train {
    return this.train;
  }

  setRoute(route: Route): void {
    this.route = route;
  } 

  getRoute(): Route {
    return this.route;
  } 

  isAtRoute(route: Route): boolean {
    return this.route.getId() === route.getId();
  }
}

class ControlCenter implements SkyTrainMediator {
  private routes: Route[] = [];
  private positionRecord: PositionRecord[] = [];

  private identifyTrainAt(currentRoute: Route): Train {
    const currentPos = this.findRoutePos(currentRoute);

    if (currentPos === -1) throw new Error(`ไม่พบ ${currentRoute.getId()} ในเส้นทาง`);

    const previousRoute = this.routes[currentPos - 1];
    
    if (!previousRoute) throw new Error(`ไม่พบเส้นทางก่อนหน้าของ ${currentRoute.getId()}`);
    
    const record = this.positionRecord.find(r => r.isAtRoute(previousRoute) && r.getTrain().getSpeed() > 0);

    if (!record) throw new Error(`ไม่พบขบวนที่อยู่บนเส้นทาง ${currentRoute.getId()}`);
    
    return record.getTrain();
  }

  private findRoutePos(route: Route): number {
    return this.routes.findIndex(r => r === route);
  }
  
  addTrain(train: Train, depot: Depot): void {
    this.positionRecord.push(new PositionRecord(train, depot));
  }
  
  addRoute(route: Route, pos: number): void {
    this.routes.splice(pos, 0, route);
  }
  
  notify(sender: SkyTrainSystem, event: string): void {

    if (sender instanceof Train && event === 'departs') {
      const train = sender as Train;

      return this.handleTrainDeparts(train);
    }

    if (sender instanceof Station && event === 'arrive') {
      const station = sender as Station;

      return this.handleStationArrives(station);
    }

    if (sender instanceof Signaling) {
      const signaling = sender as Signaling;

      switch (event) {
        case 'trainPassedSignal': return this.handleTrainPassedSignal(signaling);
        case 'routeIsClear': return this.handleRouteIsClear(signaling);
      }
      
    }

    if (sender instanceof Depot && event === 'arrive') {
      const depot = sender as Depot;

      return this.handleDepotArrives(depot);
    }
  }

  private handleStationArrives(station: Station): void {
    const train = this.identifyTrainAt(station);

    if (!train) throw new Error(`ไม่พบขบวนรถที่กำลังเข้าสถานี ${station.getName()}`);

    station.setClearSignal(false);

    train.setSpeed(0);
    train.announcement(`สถาน${station.getName()} ${station.getName()}`);
    train.announcement(`โปรดใช้ความระมัดระวังขณะก้าวออกจากรถ`);
    train.openDoor();
    
    station.openGate();
    
    this.positionRecord.find(r => r.getTrain() === train)?.setRoute(station);
  }

  private handleTrainDeparts(train: Train): void {

    const currentRecord = this.positionRecord.find(r => r.getTrain() === train);

    if (!currentRecord) throw new Error(`ไม่พบตำแหน่งของขบวน ${train.getId()} ในระบบ`);

    const currentRoute = currentRecord.getRoute();
    const currentRoutePos = this.findRoutePos(currentRoute);

    if (currentRoutePos === -1) throw new Error(`ไม่พบ ${currentRoute.getId()} ในเส้นทาง`);

    const nextRoute = this.routes[currentRoutePos + 1]; 

    if (!nextRoute) throw new Error(`ไม่พบเส้นทางถัดไปจาก ${currentRoute.getId()}`);

    if (!nextRoute.getClearSignal()) {
      train.announcement('ขณะนี้ระบบเดินรถขัดข้องชั่วคราว... ขออภัยในความไม่สะดวกครับ');
      return;
    }
      
    // รถออกจากสถานี
    if (currentRoute instanceof Station) {
      currentRoute.announcement('ประตูชานชาลากำลังจะปิด โปรดกรุณาอย่ายืนกีดขวางบริเวณประตู ขอบคุณครับ');
      currentRoute.closeGate();
      
      train.announcement('ประตูรถกำลังจะปิด โปรดกรุณาอย่ายืนกีดขวางบริเวณประตู ขอบคุณครับ');
      train.closeDoor();
      
      train.setSpeed(40);

    } else if (currentRoute instanceof Signaling) {
      // รถออกจากสัญญาณไฟ

      train.setSpeed(40);
      this.handleTrainPassedSignal(currentRoute);
    
    } else if (currentRoute instanceof Depot) {
      // รถออกจากโรงจอด
      
      train.setSpeed(40);
      train.announcement('ขบวนรถกำลังออกจากโรงจอด...');

    }
    
    currentRoute.setClearSignal(true);
  }

  private handleTrainPassedSignal(signaling: Signaling): void {
    const train = this.identifyTrainAt(signaling);

    if (!train) throw new Error(`ไม่พบขบวนรถที่กำลังผ่านสัญญาณ ${signaling.getId()}`);

    this.positionRecord.find(r => r.getTrain() === train)?.setRoute(signaling);

    // block ถัดไปมีขบวนรถ
    if (!signaling.getClearSignal()) {
      signaling.setClearSignal(false);

      train.setSpeed(0);
      train.announcement('ขณะนี้ระบบเดินรถขัดข้องชั่วคราว... ขออภัยในความไม่สะดวกครับ');
      return;
    } 

    const currentPos = this.findRoutePos(signaling);
    
    // รถไฟออกจากสถานีผ่านตัวตรวจจับตัวแรก
    if (this.routes[currentPos - 1] instanceof Station) { 

      for (let i = currentPos + 1; i < this.routes.length; i++) {
        const next = this.routes[i];
        
        if (next instanceof Station) {
          train.announcement(`สถานีถัดไป ${ next.getName() } ${ next.getName() }`);
          train.announcement(`ประตูรถจะเปิดทางด้าน${ next.getDoorOpenSide() }`);
          train.setSpeed(80);
          
          return;
        }
      }
    }

    //  รถไฟผ่านตัวตรวจจับตัวสุดท้ายก่อนเข้าสถานี
    if (this.routes[currentPos + 1] instanceof Station) {
      const nextStation = this.routes[currentPos + 1] as Station;

      nextStation.announcement(`ขบวนรถกำลังจะเข้าสู่ชานชาลา...`);
      train.setSpeed(40);
    }
  }

  private handleRouteIsClear(signaling: Signaling): void {
    const currentPos = this.findRoutePos(signaling);
    
    if (currentPos === -1) throw new Error(`ไม่พบ ${signaling.getId()} ในเส้นทาง`);
        
    const previousRoute = this.routes[currentPos - 1];

    if (!previousRoute) throw new Error(`ไม่พบเส้นทางก่อนหน้าของ ${signaling.getId()}`);

    previousRoute.setClearSignal(true);
    
    const train = this.identifyTrainAt(signaling);

    if (train) {
      train.departs();
    };
  }

  private handleDepotArrives(depot: Depot): void {
    const lastStation = this.routes[this.routes.length - 2];
 
    if (!lastStation || !(lastStation instanceof Station)) throw new Error(`ไม่พบสถานีที่อยู่ก่อนหน้าโรงจอด ${depot.getId()}`);

    const train = this.positionRecord.find(r => r.isAtRoute(lastStation))?.getTrain();

    if (!train) throw new Error(`ไม่พบขบวนรถที่กำลังเข้าสู่โรงจอด ${depot.getId()}`);

    train.setSpeed(0);
    train.announcement('ขบวนรถกำลังเข้าสู่โรงจอด...');

    this.positionRecord.find(r => r.getTrain() === train)?.setRoute(depot);
  }    
}

// + ------------------- Colleague ------------------- + //
abstract class SkyTrainSystem {
  protected mediator: SkyTrainMediator;
  protected id: string;

  protected constructor(mediator: SkyTrainMediator, id: string) {
    this.mediator = mediator;
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}

// + --------------- Abstract Colleague --------------- + //
abstract class Route extends SkyTrainSystem {
  protected isClearSignal: boolean;

  constructor(mediator: SkyTrainMediator, id: string) {
    super(mediator, id);
    this.isClearSignal = true;
  }

  setClearSignal(status: boolean): void {
    this.isClearSignal = status;
  }

  getClearSignal(): boolean {
    return this.isClearSignal;
  }
}

// + --------------- Concrete Colleague --------------- + //

class Train extends SkyTrainSystem {
  private isDoorOpen: boolean;
  private speed: number;

  constructor(mediator: SkyTrainMediator, id: string) {
    super(mediator, id);

    this.isDoorOpen = false;
    this.speed = 0;
  } 

  departs(): void {
    this.mediator.notify(this, 'departs');
  }

  openDoor(): void {
    this.isDoorOpen = true;
  } 

  closeDoor(): void {
    this.isDoorOpen = false;
  }

  setSpeed(speed: number): void {
    console.log(`ขบวน ${this.id} >> กำลัง${speed > this.speed ? 'เพิ่ม' : 'ลด'}ความเร็วไปที่ ${speed} กม./ชม.`);
    
    this.speed = speed;
  } 

  getSpeed(): number {
    return this.speed;
  }

  announcement(msg: string): void {
    console.log(`ประกาศขบวน ${this.id} >> ${msg}`);
  } 

}

class Station extends Route {
  private name: string;
  private isGateOpen: boolean;
  private doorOpenSide: string;

  constructor(mediator: SkyTrainMediator, id: string, name: string, doorOpenSide: string) {
    super(mediator, id);

    this.name = name;
    this.doorOpenSide = doorOpenSide;
    this.isGateOpen = false;
  }

  arrive(): void {
    this.mediator.notify(this, 'arrive');
  }

  openGate(): void {
    this.isGateOpen = true;
  }

  closeGate(): void {
    this.isGateOpen = false;
  }

  announcement(msg: string): void {
    console.log(`ประกาศสถานี ${this.name} >> ${msg}`);
  }

  getName(): string {
    return this.name;
  }

  getDoorOpenSide(): string {
    return this.doorOpenSide;
  }
}

class Signaling extends Route {
  constructor(mediator: SkyTrainMediator, id: string) {
    super(mediator, id);
  }

  trainPassedSignal(): void {
    this.mediator.notify(this, 'trainPassedSignal');
  }

  setClearSignal(status: boolean): void {
    super.setClearSignal(status);

    if (status) {
      this.mediator.notify(this, 'routeIsClear');
    }
  }
}

class Depot extends Route {
  constructor(mediator: SkyTrainMediator, id: string) {
    super(mediator, id);
  }

  setClearSignal(status: boolean): void {
    this.isClearSignal = true;
  }

  arrive(): void {
    this.mediator.notify(this, 'arrive');
  }
}

// + -------------------- Client --------------------- + //

const controlCenter = new ControlCenter();

const trainT001 = new Train(controlCenter, 'T001');

const depot = new Depot(controlCenter, 'depot-1');

const stationS12_I = new Station(controlCenter, 'S12_I', 'บางหว้า', 'ซ้าย');

const signalS12_I_01 = new Signaling(controlCenter, 'S12_I_01');
const signalS12_I_02 = new Signaling(controlCenter, 'S12_I_02');
const signalS12_I_03 = new Signaling(controlCenter, 'S12_I_03');

const stationS11_I = new Station(controlCenter, 'S11_I', 'วุฒากาศ', 'ซ้าย');

const signalS11_I_01 = new Signaling(controlCenter, 'S11_I_01');
const signalS11_I_02 = new Signaling(controlCenter, 'S11_I_02');
const signalS11_I_03 = new Signaling(controlCenter, 'S11_I_03');

const stationS06_I = new Station(controlCenter, 'S06_I', 'สะพานตากสิน', 'ขวา');
const signalS06_I_01 = new Signaling(controlCenter, 'S06_I_01');
const signalS06_I_02 = new Signaling(controlCenter, 'S06_I_02');
const signalS06_I_03 = new Signaling(controlCenter, 'S06_I_03');

const stationS05_I = new Station(controlCenter, 'S05_I', 'สุรศักดิ์', 'ซ้าย');

const stationS05_O = new Station(controlCenter, 'S05_O', 'สุรศักดิ์', 'ซ้าย');
const signalS05_O_01 = new Signaling(controlCenter, 'S05_O_01');
const signalS05_O_02 = new Signaling(controlCenter, 'S05_O_02');
const signalS05_O_03 = new Signaling(controlCenter, 'S05_O_03');

const stationS06_O = new Station(controlCenter, 'S06_O', 'สะพานตากสิน', 'ซ้าย');
const signalS06_O_01 = new Signaling(controlCenter, 'S06_O_01');
const signalS06_O_02 = new Signaling(controlCenter, 'S06_O_02');
const signalS06_O_03 = new Signaling(controlCenter, 'S06_O_03');

const stationS12_O = new Station(controlCenter, 'S12_O', 'บางหว้า', 'ซ้าย');

controlCenter.addTrain(trainT001, depot);

controlCenter.addRoute(depot, 0);

controlCenter.addRoute(stationS12_I, 1);
controlCenter.addRoute(signalS12_I_01, 2);
controlCenter.addRoute(signalS12_I_02, 3);
controlCenter.addRoute(signalS12_I_03, 4);

controlCenter.addRoute(stationS11_I, 5);
controlCenter.addRoute(signalS11_I_01, 6);
controlCenter.addRoute(signalS11_I_02, 7);
controlCenter.addRoute(signalS11_I_03, 8);

controlCenter.addRoute(stationS06_I, 9);
controlCenter.addRoute(signalS06_I_01, 10);
controlCenter.addRoute(signalS06_I_02, 11);
controlCenter.addRoute(signalS06_I_03, 12);

controlCenter.addRoute(stationS05_O, 13);
controlCenter.addRoute(signalS05_O_01, 14);
controlCenter.addRoute(signalS05_O_02, 15);
controlCenter.addRoute(signalS05_O_03, 16);

controlCenter.addRoute(stationS06_O, 17);
controlCenter.addRoute(signalS06_O_01, 18);
controlCenter.addRoute(signalS06_O_02, 19);
controlCenter.addRoute(signalS06_O_03, 20);

controlCenter.addRoute(stationS12_O, 21);
controlCenter.addRoute(depot, 22);

// ออกรถ
console.log('======================================== สถานการปกติ ========================================');

trainT001.departs();
console.log('\n');

stationS12_I.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

signalS12_I_01.trainPassedSignal();
console.log('\n');

signalS12_I_02.trainPassedSignal();
console.log('\n');

signalS12_I_03.trainPassedSignal();
console.log('\n');

stationS11_I.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

signalS11_I_01.trainPassedSignal();
console.log('\n');

signalS11_I_02.trainPassedSignal();
console.log('\n');

signalS11_I_03.trainPassedSignal();
console.log('\n');

stationS06_I.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

signalS06_I_01.trainPassedSignal();
console.log('\n');

signalS06_I_02.trainPassedSignal();
console.log('\n');

signalS06_I_03.trainPassedSignal();
console.log('\n');

stationS05_O.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

signalS05_O_01.trainPassedSignal();
console.log('\n');

signalS05_O_02.trainPassedSignal();
console.log('\n');

signalS05_O_03.trainPassedSignal();
console.log('\n');

stationS06_O.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

signalS06_O_01.trainPassedSignal();
console.log('\n');

signalS06_O_02.trainPassedSignal();
console.log('\n');

signalS06_O_03.trainPassedSignal();
console.log('\n');

stationS12_O.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

depot.arrive();
console.log('\n');

console.log('======================================== สถานการผิดปกติ ========================================');

const trainT002 = new Train(controlCenter, 'T002');

controlCenter.addTrain(trainT002, depot);

trainT002.departs();
console.log('\n');

stationS12_I.arrive();
console.log('\n');

trainT001.departs();
console.log('\n');

trainT002.departs();
console.log('\n');

trainT001.departs();
console.log('\n');

stationS12_I.arrive();
console.log('\n');
