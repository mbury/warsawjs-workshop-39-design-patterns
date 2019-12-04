// class Rental {
//   constructor(car_id, client_id, deposit) {
//     this.car_id = car_id;
//     this.client_id = client_id;
//     this.deposit = deposit;
//     this.state = 'RESERVED';
//   }
//   payDeposit() {
//     if (this.state !== 'RESERVED') {
//       return;
//     }
//     this.state = 'DEPOSIT_PAID';
//   }

//   returnDeposit() {
//     if (this.state !== 'DEPOSIT_PAID' && this.state !== 'CAR_RETURNED') {
//       return;
//     }
//     this.state = 'DEPOSIT_SETTLED';
//   }
//   takeCar() {
//     if (this.state !== 'DEPOSIT_PAID') {
//       return;
//     }
//     this.state = 'CAR_IN_USE';
//   }
//   returnCar() {
//     if (this.state !== 'CAR_IN_USE') {
//       return;
//     }
//     this.state = 'CAR_RETURNED';
//   }
// }

class Rental {
  constructor(
    rental_id,
    car_id,
    client_id,
    deposit,
    state = RentalState.RESERVED
  ) {
    this.rental_id = rental_id;
    this.car_id = car_id;
    this.client_id = client_id;
    this.deposit = deposit;
    this.state = state;
  }
  getState() {
    return this.state;
  }
  setState(state) {
    return (this.state = state);
  }
  static from(dto) {
    const { car_id, client_id, deposit, state } = dto;
    const rentalState = RentalState.from(state);
    return new Rental(car_id, client_id, deposit, rentalState);
  }
  payDeposit() {
    this.state.payDeposit(this);
  }

  returnDeposit() {
    this.state.returnDeposit(this);
  }
  takeCar() {
    this.state.takeCar(this);
  }
  returnCar() {
    this.state.returnCar(this);
  }
  static get RentalState() {
    return RentalState;
  }
}

class RentalState {
  constructor(name) {
    this.name = name;
  }

  equals(state) {
    return this.name === state.name;
  }

  payDeposit() {
    throw new Error('State transition not supported');
  }

  returnDeposit() {
    throw new Error('State transition not supported');
  }

  static from(state) {
    return RentalState[state];
  }
  static get RESERVED() {
    return new RentalReserved('RESERVED');
  }
  static get DEPOSIT_PAID() {
    return new RentalDepositPaid('DEPOSIT_PAID');
  }
  static get DEPOSIT_SETTLED() {
    return new RentalState('DEPOSIT_SETTLED');
  }
  static get CAR_IN_USE() {
    return new RentalCarInUse('CAR_IN_USE');
  }
  static get CAR_RETURNED() {
    return new RentalCarReturned('CAR_RETURNED');
  }
}

class RentalReserved extends RentalState {
  payDeposit(rental) {
    rental.setState(RentalState.DEPOSIT_PAID);
  }
}

class RentalDepositPaid extends RentalState {
  returnDeposit(rental) {
    rental.setState(RentalState.DEPOSIT_SETTLED);
  }
  takeCar(rental) {
    rental.setState(RentalState.CAR_IN_USE);
  }
}

class RentalCarInUse extends RentalState {
  returnCar(rental) {
    rental.setState(RentalState.CAR_RETURNED);
  }
}

class RentalCarReturned extends RentalState {
  returnDeposit(rental) {
    rental.setState(RentalState.DEPOSIT_SETTLED);
  }
}
module.exports = Rental;
