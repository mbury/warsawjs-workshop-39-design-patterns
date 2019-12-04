const knex = require('knex')(require('../../knexfile'));

class Handler {
  constructor() {
    this.next = {
      handleRequest: function() {
        console.log('All strategies exhausted.');
      },
    };
  }
  setNext(next) {
    this.next = next;
    return next;
  }
  handleRequest() {}
}

class CarIsRented extends Handler {
  setNext(next) {
    this.next = next;
    return next;
  }
  handleRequest(request) {
    const { car_id } = request;
    return knex('rentals')
      .select('*')
      .whereNotIn('state', ['DEPOSIT_SETTLED', 'CAR_RETURNED'])
      .andWhere({ car_id })
      .then(data => {
        console.log({ data });
        if (data.length > 0) {
          throw new Error('Car is rented');
        }
        return this.next.handleRequest(request);
      });
  }
}

class ClientHasRentedCar extends Handler {
  setNext(next) {
    this.next = next;
    return next;
  }
  handleRequest(request) {
    const { client_id } = request;
    return knex('rentals')
      .select('*')
      .whereNotIn('state', ['DEPOSIT_SETTLED', 'CAR_RETURNED'])
      .andWhere({ client_id })
      .then(data => {
        if (data.length > 0) {
          throw new Error('User has rented car');
        }
        return this.next.handleRequest(request);
      });
  }
}

describe('Chain', () => {
  test('run', async () => {
    var strategy1 = new CarIsRented();
    var strategy2 = new ClientHasRentedCar();

    strategy1.setNext(strategy2);
    await strategy1.handleRequest({ car_id: 1, client_id: 1 });
  });
});
