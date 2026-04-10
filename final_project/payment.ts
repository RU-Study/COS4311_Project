const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

// + ------------------- Template Method: Abstract Class ------------------- + //
abstract class PaymentProcess {
  protected amount: number;

  protected constructor(amount: number) {
    this.amount = amount;
  }

  displayAmount(): void {
    console.log(` - ยอดที่ต้องชำระ: ฿${this.amount}`);
  }
  
  abstract makePayment(): void
  abstract verifyAmount(): Promise<void>
  abstract confirmPayment(): Promise<void>

  dispenseChange(): Promise<void> {
    return Promise.resolve();
  }
  
  async proceedPayment(): Promise<boolean> {
    console.log('\n ---------------------- ดำเนินการชำระเงิน ---------------------- \n');
    
    this.displayAmount();
    this.makePayment();
    await this.verifyAmount();
    await this.confirmPayment();
    await this.dispenseChange();

    console.log('\n ------------------------------------------------------------ \n');

    return true;
  }
}

// + ------------------- Template Method: Concrete Class ------------------- + //
export class CashPayment extends PaymentProcess {
  private change: number;

  constructor(amount: number) {
    super(amount);

    this.change = 0;
  }

  makePayment(): Promise<void> {
    console.log(` - กรุณาสอดธนบัตรหรือหยอดเหรียญลงในช่องรับเงิน...\n`);
    return Promise.resolve();
  }

  async verifyAmount(): Promise<void> {
    
    const rl = readline.createInterface({ input, output });
    let paidAmount = 0;

    while (true) {
      const answer = await rl.question(' - จำนวนเงินที่ชำระมา: ');
      paidAmount = parseFloat(answer);

      if (!isNaN(paidAmount) && paidAmount >= this.amount) break; 
      
      console.log('    !! กรุณาสอดธนบัตรหรือหยอดเหรียญให้ครบตามยอดที่ต้องชำระ\n');
    }
    rl.close();
    
    this.change = paidAmount - this.amount;
  }

  async confirmPayment(): Promise<void> {
    console.log(` - ชำระเงินเรียบร้อยแล้วกรุณา ${this.change > 0 ? `รับเงินทอน ${this.change.toFixed(2)} ของคุณและ` : ''} รอเครื่องดื่มของคุณสักครู่...`);
    return Promise.resolve();
  }

  override dispenseChange(): Promise<void> {
    if (this.change > 0) {
      console.log(` - ดำเดินการทอนเงินจำนวน: ฿${this.change.toFixed(2)}`);
    }

    return Promise.resolve();
  }
}

export class QRPayment extends PaymentProcess {
  constructor(amount: number) {
    super(amount);
  }

  makePayment(): void {
    console.log(` - กรุณาสแกน QR Code เพื่อชำระเงิน...`);
  }

  async verifyAmount(): Promise<void> {
    console.log(' - กำลังยืนยันการชำระเงินกับธนาคาร...');
    
    await new Promise(resolve => setTimeout(() => {

      console.log(' - การชำระเงินได้รับการยืนยันแล้ว');
      resolve(undefined);

    }, 1000));

    return Promise.resolve();
  }

  async confirmPayment(): Promise<void> {
    console.log(` - ชำระเงินเรียบร้อยแล้วกรุณารอเครื่องดื่มของคุณสักครู่...`);
    return Promise.resolve();
  }

}