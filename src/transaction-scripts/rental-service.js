const db = require('./database-gateway');

async function rentCar(carId, clientId) {
  const car = await db.findCar(carId);
  const client = await db.findClient(clientId);
  const clientRentalCount = await db.rentalCountFor(clientId);

  let deposit = 0;
  if (clientRentalCount < 1 && !client.isVip) {
    deposit = Math.max(10000, car.price * 0.2);
  } else if (clientRentalCount >= 1 && !client.isVip) {
    deposit = Math.min(Math.max(10000, car.price * 0.15), 60000);
  } else if (client.isVip) {
    deposit = Math.min(Math.max(5000, car.price * 0.1), 40000);
  }

  await db.insertRental(carId, clientId, deposit);
}

const rentalService = {
  rentCar,
};

module.exports = rentalService;
