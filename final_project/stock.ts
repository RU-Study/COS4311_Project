export class Ingredient {
  private name: string;
  private quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }

  setQuantity(newQty: number): void {
    this.quantity = newQty;
  }  

  getQuantity(): number {
    return this.quantity;
  }

  getName(): string {
    return this.name;
  }
}

export class VendingStock {
  private stock: Ingredient[] = [];

  updateStock(ing: Ingredient): number {
    
    // ! ตรวจสอบว่ามีวัตถุดิบนี้อยู่ใน stock หรือไม่ //
    const index = this.stock.findIndex((item) => item.getName() === ing.getName());

    if (index === -1) {
      // * กรณีไม่มีอยู่: ทำการเพิ่มวัตถุดิบใหม่ลงใน stock //
    
      this.stock.push(ing);

      return ing.getQuantity();
    }
    
    // * กรณีมีอยู่: ทำการอัปเดตจำนวนวัตถุดิบใน stock //
    const curIngredient = this.stock[index]!;
    const newQty = curIngredient.getQuantity() + ing.getQuantity();

    curIngredient.setQuantity(newQty);
    
    return newQty;
  }

  checkStock(name: string): number {
    const index = this.stock.findIndex((item) => item.getName() === name);

    if (index === -1) throw new Error(`ไม่พบวัตถุดิบ: ${name} ในสต็อก`);
  
    return this.stock[index]!.getQuantity();
  }

  getStock(): Ingredient[] {
    return this.stock;
  }
}