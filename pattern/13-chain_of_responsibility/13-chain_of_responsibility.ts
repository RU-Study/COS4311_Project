// + -------------------- Handler --------------------- + //
interface Handler {
  setNext(handler: Handler): void;
  handle<T>(value: T[]): void;
}

// + ------------------ Base Handler ------------------ + //
class FormValidateHandler implements Handler {
  private nextHandler: Handler | undefined;
  protected sequence: number;

  constructor(sequence: number) {
    this.sequence = sequence;
  }

  setNext(handler: Handler): void {
    this.nextHandler = handler;
  }

  handle<T>(value: T[]): void {
    if (this.nextHandler !== undefined) {
      this.nextHandler.handle(value);
    }
  }
}

// + ---------------- Concrete Handler ---------------- + //
class StringEmptyHandler extends FormValidateHandler {
  handle<T>(value: T[]): void {
    if (this.sequence > value.length) throw new Error(`ไม่พบข้อมูลตำแหน่งที่ ${this.sequence}`);
    
    const currentValue = value[this.sequence];
    
    if (typeof currentValue !== 'string') throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ต้องเป็นตัวอักษร`);

    if (currentValue === '') throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ต้องไม่เป็นค่าว่าง`);
    
    super.handle(value);
  }
}

class NumberRangeHandler extends FormValidateHandler {
  private min: number;
  private max: number;

  constructor(sequence: number, min: number, max: number) {
    super(sequence);
    this.min = min;
    this.max = max;
  }

  handle<T>(value: T[]): void {
    if (this.sequence > value.length) throw new Error(`ไม่พบข้อมูลตำแหน่งที่ ${this.sequence}`);
    
    const currentValue = value[this.sequence];
    
    if (typeof currentValue !== 'number') throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ต้องเป็นตัวเลข`);

    if (currentValue < this.min || currentValue > this.max) throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ต้องอยู่ในช่วง ${this.min} - ${this.max}`);

    super.handle(value);
  }
}

class RegExHandler extends FormValidateHandler {
  private pattern: RegExp;

  constructor(sequence: number, pattern: RegExp) {
    super(sequence);
    this.pattern = pattern;
  }

  handle<T>(value: T[]): void {
    if (this.sequence > value.length) throw new Error(`ไม่พบข้อมูลตำแหน่งที่ ${this.sequence}`);
    
    const currentValue = value[this.sequence];
    
    if (typeof currentValue !== 'string') throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ต้องเป็นตัวอักษร`);
    if (!this.pattern.test(currentValue)) throw new Error(`ข้อมูลตำแหน่งที่ ${this.sequence}: ไม่ตรงตามรูปแบบ`);

    super.handle(value);
  }
}

// + --------------------- Client --------------------- + //

function saveForm<T>(data: T[]) {
  const nameValidate = new StringEmptyHandler(0);
  const surnameValidate = new StringEmptyHandler(1);
  const ageValidate = new NumberRangeHandler(2, 15, 55);
  const telNumberValidate = new RegExHandler(3, /^0\d{2}-?\d{3}-?\d{4}$/);
  
  nameValidate.setNext(surnameValidate);
  surnameValidate.setNext(ageValidate);
  ageValidate.setNext(telNumberValidate);

  try {
    nameValidate.handle(data);
    console.log('\n--------------------------------------------------\n');

    console.log('บันทึกข้อมูลสำเร็จ');
  } catch (error) {

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

saveForm(['', '', 5, '123-456-7890']);
saveForm(['สมหมาย', '', 5, '123-456-7890']);
saveForm(['สมหมาย', 'มีสุข', 5, '123-456-7890']);
saveForm(['สมหมาย', 'มีสุข', 25, '123-456-7890']);
saveForm(['สมหมาย', 'มีสุข', 25, '081-234-5678']);