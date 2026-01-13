// + ------------ Prototype ------------ + //
interface Product {
  clone(): Product;
  show(): void;
}

// + -------- Concrete Prototype -------- + //
class FloorFan implements Product {
  private size: number;

  constructor(size: number);
  constructor(product: Product);

  constructor(params: number | Product) {
    
    if (typeof params === "number") {
      this.size = params;
    } else if (params instanceof FloorFan) {
      this.size = params.size;
    } else {
      this.size = 0;
    }

  }

  clone(): Product {
    return new FloorFan(this);
  }

  show(): void {
    console.log(`พัดลมตั้งพื้นขนาด ${this.size} นิ้ว`);
  }
}

class CeilingFan implements Product {
  protected bladesNum: number;

  constructor(bladesNum: number);
  constructor(product: Product);

  constructor(params: number | Product) {
    
    if (typeof params === "number") {
      this.bladesNum = params;
    } else if (params instanceof CeilingFan) {
      this.bladesNum = params.bladesNum;
    } else {
      this.bladesNum = 0;
    }

  }

  clone(): Product {
    return new CeilingFan(this);
  }

  show(): void {
    console.log(`พัดลมเพดานประเภท ${this.bladesNum} ใบพัด`);
  }
}

class CeilingFanWithLamp extends CeilingFan implements Product {
  protected lampNum: number;

  constructor(blades: number, lamp: number);
  constructor(product: Product);

  constructor(params1: number | Product, params2?: number) {
    
    if (typeof params1 === "number" && typeof params2 === "number" ) {
      super(params1);
      this.lampNum = params2;

    } else if (params1 instanceof CeilingFanWithLamp) {
      super(params1);
      this.lampNum = params1.lampNum;

    } else {
      super(0);
      this.lampNum = 0;
    }

  }

  override clone(): Product {
    return new CeilingFanWithLamp(this);
  }

  override show(): void {
    console.log(`พัดลมเพดานประเภท ${this.bladesNum} ใบพัด พร้อมหลอดไฟ ${this.lampNum} ดวง`);
  }
}

// + ------------ Client ------------ + //
class Order {
  private product: Product;
  private quantity: number;

  constructor(fan: Product, qty: number) {
    this.product = fan;
    this.quantity = qty;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }
}

class OrderManager {
  private orders: Order[] = []

  addOrder(order: Order) {
    this.orders.push(order);
  }

  makeProduct(): Product[] {
    const products: Product[] = [];  

    this.orders.forEach(order => {
      const product: Product = order.getProduct();
      const qty: number = order.getQuantity();

      for (let i = 0; i < qty; i++) {
        products.push(product.clone());        
      }
    })

    return products;
  }
}


const floorFan1 = new FloorFan(16);
const floorFan2 = new FloorFan(18);

const ceilingFan1 = new CeilingFan(3);
const ceilingFan2 = new CeilingFan(5);

const ceilingLamp1 = new CeilingFanWithLamp(3, 4);
const ceilingLamp2 = new CeilingFanWithLamp(5, 3);

const orders = new OrderManager();

[
  new Order(floorFan1, 2),
  new Order(floorFan2, 3),
  new Order(ceilingFan1, 4),
  new Order(ceilingFan2, 5),
  new Order(ceilingLamp1, 6),
  new Order(ceilingLamp2, 7),
].forEach(order => orders.addOrder(order));

const products = orders.makeProduct();

products.forEach(product => product.show());