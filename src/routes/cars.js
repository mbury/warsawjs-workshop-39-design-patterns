var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));

router.get('/', async function(req, res) {
  const cars = await knex('cars').select('*');
  res.render('cars', { cars, title: 'Samochody do wypożyczenia' });
});

router.get('/:car_id/rent', async function(req, res) {
  const { car_id } = req.params;
  const client_id = req.session.user.user_id;

  const car = await knex('cars')
    .first()
    .where('car_id', car_id);
  const { clientRentalCount } = await knex('rentals')
    .first()
    .count('client_id as clientRentalCount')
    .where('client_id', client_id);
  const client = await knex('users')
    .first()
    .where('user_id', client_id);

  let deposit = 0;
  if (clientRentalCount < 1 && !client.isVip) {
    deposit = Math.max(10000, car.price * 0.2);
  } else if (clientRentalCount >= 1 && !client.isVip) {
    deposit = Math.min(Math.max(10000, car.price * 0.15), 60000);
  } else if (client.isVip) {
    deposit = Math.min(Math.max(5000, car.price * 0.1), 40000);
  }

  await knex('rentals').insert({
    car_id,
    client_id,
    deposit,
    state: 'RESERVED',
  });

  res.redirect('/rentals');
});

module.exports = router;
