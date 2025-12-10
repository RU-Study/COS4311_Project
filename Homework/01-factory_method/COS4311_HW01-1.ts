interface Vehicle {
  move(): void;
}

class Truck implements Vehicle {
  move(): void {
    console.log("รถบรรทุกกำลังเคลื่อนที่");
  }
}

class Ship implements Vehicle {
  move(): void {
    console.log("เรือกำลังเคลื่อนที่");
  }
}

abstract class Transportation {
  abstract getVehicle(): Vehicle;

  transport(): void {
    const vehicle = this.getVehicle();
    vehicle.move();
  }
}

class LandTransport extends Transportation {
  getVehicle(): Vehicle {
    return new Truck();
  }
}

class WaterTransport extends Transportation {
  getVehicle(): Vehicle {
    return new Ship();
  }
}

function transport(transportation: Transportation) {
  transportation.transport();
}

transport(new LandTransport());
transport(new WaterTransport());