// + ------------------- Observer -------------------- + //
abstract class Observer {
  protected id: string;

  protected constructor() {
    this.id = crypto.randomUUID();
  }

  getId(): string {
    return this.id;
  }

  abstract update(newStatus: string): void;
}

// + --------------- Concrete Observer --------------- + //
class EmailNotify extends Observer {
  private email: string;

  constructor(email: string) {
    super();
    this.email = email;
  }

  update(newStatus: string): void {
    let message = '';

    switch (newStatus) {
      case 'Healthy': message = 'Server ทำงานได้ปกติแล้ว'; break;
      case 'Warning': message = 'Server มีปัญหาเล็กน้อย'; break;
      case 'Critical': message = 'Server อยู่ในสถานะวิกฤตแล้ว'; break;
      
      default: message = 'Server หยุดการทำงานแล้ว'; break;
    }
    
    console.log(`ส่งอีเมลไปที่ ${this.email} : ${message}`);
  }
}

class APIGateway extends Observer {
  private isAvailable: boolean = true;

  constructor() {
    super();
  }

  handleRequest(request: string): string {
    if (!this.isAvailable) {
      return 'HTTP Status 503 :>> Service Unavailable';
    }

    return `HTTP Status 200 :>> ประมวลผลคำขอ ${request} สำเร็จแล้ว`;
  }

  update(newStatus: string): void {
    this.isAvailable = newStatus === 'Healthy' || newStatus === 'Warning';
    
    console.log(`API Gateway is now ${this.isAvailable ? 'available' : 'unavailable'}`);
  }
}

// + ------------------ Publisher -------------------- + //
class Server {
  private status: string = 'Healthy'
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(id: string): void {
    this.observers = this.observers.filter(observer => observer.getId() !== id);
  }

  notify(): void {
    this.observers.forEach(observer => observer.update(this.status));
  }

  setStatus(newStatus: string) {
    this.status = newStatus;
    this.notify();
  }
}

// + -------------------- Client --------------------- + //
const server = new Server();

const adminEmail = new EmailNotify('admin@example.com');
const managerEmail = new EmailNotify('manager@example.com');

const apiGateway = new APIGateway();

server.subscribe(adminEmail);
server.subscribe(managerEmail);
server.subscribe(apiGateway);

console.log('\n----------------------------------------\n\n');

server.setStatus('Warning');
console.log('\n', apiGateway.handleRequest('GET /api/data'));
console.log('\n----------------------------------------');

server.setStatus('Unreachable');
console.log('\n', apiGateway.handleRequest('GET /api/data'));
console.log('\n----------------------------------------\n\n');

server.setStatus('Healthy');
console.log('\n', apiGateway.handleRequest('GET /api/data'));
console.log('\n----------------------------------------\n\n');

server.setStatus('Critical');
console.log('\n', apiGateway.handleRequest('GET /api/data'));
console.log('\n----------------------------------------\n\n');