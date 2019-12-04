const EventBus = require('./event-bus');
const knex = require('knex')(require('../../knexfile'));
var debug = require('debug')('app:event-bus');

const notify = rental => {
  knex('users')
    .first()
    .where('user_id', rental.client_id)
    .then(client => {
      debug('Send confirmation mail to: ' + client.mail);
    });
};

const runInBatch = command => {
  let queue = [];
  return data => {
    queue.push(() => command(data));
    if (queue.length >= 2) {
      const runNow = [...queue];
      queue = [];
      runNow.forEach(run => {
        run();
      });
    }
  };
};

EventBus.subscribe('RENTAL_COMPLETE', runInBatch(notify));
