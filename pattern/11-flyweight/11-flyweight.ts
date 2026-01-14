// + ------------ Flyweight ------------ + //
class Product {
  private id: number;
  private name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): number {
    return this.id;
  }

  getProductDetail(price: number, qty: number): string {
    return `รหัสสินค้า: ${this.id}\nชื่อสินค้า: ${this.name}\nราคา: ${price}\nจำนวนในสต็อก: ${qty}`;
  }
}

// + ------------ Flyweight Factory ------------ + //
class ProductList {
  private products: Product[] = [];

  getProduct(id: number, name: string): Product {

    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i]!;
      
      if (product.getId() === id) {
        return product;
      }
    }

    const product = new Product(id, name);

    this.products.push(product);

    return product;
  }
}

// + ------------ Context ------------ + //
class Stock {
  private price: number;
  private quantity: number;
  private product: Product;

  constructor(price: number, qty: number, product: Product) {
    this.price = price;
    this.quantity = qty;
    this.product = product;
  }

  getProductDetail(): string {
    return this.product.getProductDetail(this.price, this.quantity);
  }
}

// + ------------ Client ------------ + //
class Shop {
  private stock: Stock[] = [];
  private list: ProductList = new ProductList();

  addStock(id: number, name: string, price: number, qty: number) {
    const product = this.list.getProduct(id, name);

    this.stock.push(new Stock(price, qty, product));
    console.log(`เพิ่ม ${name} ลงในสต็อกแล้ว`);
  }

  showProductInStock(): void {
    console.log('\n-------------------- รายการสินค้าในสต็อก --------------------\n');
    
    this.stock.forEach((productStock: Stock) => {
      console.log(productStock.getProductDetail() + "\n");
    });

    console.log('\n----------------------------------------------------------\n');
  }
}

const sixTenShop = new Shop();

sixTenShop.addStock(1, 'นมสด 250 ม.ล.', 12.5, 50);
sixTenShop.addStock(2, 'ข้าวสาร 5 ก.ก.', 199, 20);
sixTenShop.addStock(3, 'ไข่ไก่คละไส้ 12 ฟอง', 69, 35);

sixTenShop.showProductInStock();