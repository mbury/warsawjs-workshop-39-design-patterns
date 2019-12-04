const Rental = require('../domain-model/rental');

describe('Rental class', () => {
  test('should change state to deposit paid', () => {
    const builder = new RentalBuilder();
    const rental = builder
      .selectCar(1)
      .rentBy(1)
      .depositAmount(6000)
      .build();
    rental.payDeposit();

    expect(rental.getState().equals(Rental.RentalState.DEPOSIT_PAID)).toBe(
      true
    );
  });

  test('should change state to deposit settled', () => {
    const builder = new RentalBuilder();
    const rental = builder.buildPaid();
    rental.returnDeposit();

    expect(rental.getState().equals(Rental.RentalState.DEPOSIT_SETTLED)).toBe(
      true
    );
  });
});

class RentalBuilder {
  constructor() {
    this.rental_id = 1;
  }
  rentBy(client_id) {
    this.client_id = client_id;
    return this;
  }
  selectCar(car_id) {
    this.car_id = car_id;
    return this;
  }

  depositAmount(deposit) {
    this.deposit = deposit;
    return this;
  }
  inState(state) {
    this.state = state;
    return this;
  }

  buildPaid() {
    return this.selectCar(1)
      .rentBy(1)
      .depositAmount(6000)
      .inState(Rental.RentalState.DEPOSIT_PAID)
      .build();
  }

  build() {
    const { rental_id, car_id, client_id, deposit, state } = this;
    return new Rental(rental_id, car_id, client_id, deposit, state);
  }
}
