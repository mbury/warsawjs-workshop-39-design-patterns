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

class Strategy1 extends Handler {
  setNext(next) {
    this.next = next;
    return next;
  }
  handleRequest(request) {
    const { car_id } = request;
    console.log('Strategy1');
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

class Strategy2 extends Handler {
  setNext(next) {
    this.next = next;
    return next;
  }
  handleRequest(request) {
    const { client_id } = request;
    console.log('Strategy2');
    return knex('rentals')
      .select('*')
      .whereNotIn('state', ['DEPOSIT_SETTLED', 'CAR_RETURNED'])
      .andWhere({ client_id })
      .then(data => {
        console.log({ data });
        if (data.length > 0) {
          throw new Error('User has rented car');
        }
        return this.next.handleRequest(request);
      });
  }
}

// describe('Chain', () => {
//   test('run', async () => {
//     var strategy1 = new Strategy1();
//     var strategy2 = new Strategy2();

//     strategy1.setNext(strategy2);
//     await strategy1.handleRequest({ car_id: 1, client_id: 1 });
//   });
// });
