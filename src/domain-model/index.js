const db = require('../transaction-scripts/database-gateway');

async function rentCar(carId, clientId) {
  const car = await db.findCar(carId);
  const client = await db.findClient(clientId);
  const rentalCount = await db.rentalCountFor(clientId);

  const calculator = createDepositCalculator(client, car, rentalCount);
  const deposit = calculator.deposit;

  await db.insertRental(carId, clientId, deposit);
}

function createDepositCalculator(aClient, aCar, aRentalCount) {
  if (aRentalCount < 1 && !aClient.isVip) {
    return new NewClientStrategy(aCar);
  } else if (aRentalCount >= 1 && !aClient.isVip) {
    return new StandardClientStrategy(aCar);
  } else if (aClient.isVip) {
    return new VipClientStrategy(aCar);
  }
}
class DepositCalculator {
  constructor(car) {
    this.car = car;
  }

  get deposit() {
    throw new Error('subclass responsibility');
  }
}

class NewClientStrategy extends DepositCalculator {
  get deposit() {
    return Math.max(10000, this.car.price * 0.2);
  }
}

class StandardClientStrategy extends DepositCalculator {
  get deposit() {
    return Math.min(Math.max(10000, this.car.price * 0.15), 60000);
  }
}

class VipClientStrategy extends DepositCalculator {
  get deposit() {
    return Math.min(Math.max(5000, this.car.price * 0.1), 40000);
  }
}

const rentalService = {
  rentCar,
};

module.exports = rentalService;
