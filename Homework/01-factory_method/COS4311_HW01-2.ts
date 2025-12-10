interface Pizza {
  prepare(): void;
  bake (): void;
  cut(): void;
  box(): void;
}

class BaconPizza implements Pizza {
  prepare(): void {
    console.log("กำลังเตรียมพิซซ่าหน้าเบคอน");
  }

  bake(): void {
    console.log("กำลังอบพิซซ่าหน้าเบคอน");
  }

  cut(): void {
    console.log("กำลังหั่นพิซซ่าหน้าเบคอน");
  }

  box(): void {
    console.log("กำลังบรรจุพิซซ่าหน้าเบคอนลงกล่อง");
  }
}

class TunaPizza implements Pizza {
  prepare(): void {
    console.log("กำลังเตรียมพิซซ่าหน้าทูน่า");
  }

  bake(): void {
    console.log("กำลังอบพิซซ่าหน้าทูน่า");
  }

  cut(): void {
    console.log("กำลังหั่นพิซซ่าหน้าทูน่า");
  }

  box(): void {
    console.log("กำลังบรรจุพิซซ่าหน้าทูน่าลงกล่อง");
  }
}

class GrilledPorkNeckPizza implements Pizza {
  prepare(): void {
    console.log("กำลังเตรียมพิซซ่าหน้าคอหมูย่าง");
  }

  bake(): void {
    console.log("กำลังอบพิซซ่าหน้าคอหมูย่าง");
  }

  cut(): void {
    console.log("กำลังหั่นพิซซ่าหน้าคอหมูย่าง");
  }

  box(): void {
    console.log("กำลังบรรจุพิซซ่าหน้าคอหมูย่างลงกล่อง");
  }
}

abstract class Pizzeria {
  abstract getToppings(): Pizza;

  makePizza(): void {
    const pizza: Pizza = this.getToppings();

    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
  }
}

class MakeBaconPizza extends Pizzeria {
  getToppings(): Pizza {
    return new BaconPizza();
  }
}

class MakeTunaPizza extends Pizzeria {
  getToppings(): Pizza {
    return new TunaPizza();
  }
}

class MakeGrilledPorkNeckPizza extends Pizzeria {
  getToppings(): Pizza {
    return new GrilledPorkNeckPizza();
  }
}

function makePizza(pizzeria: Pizzeria): void {
  pizzeria.makePizza();
}

makePizza(new MakeBaconPizza());
makePizza(new MakeTunaPizza());
makePizza(new MakeGrilledPorkNeckPizza());