var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));

router.get('/', async function(req, res) {
  const client_id = req.session.user.user_id;
  const rentals = await knex('rentals')
    .select('*')
    .where('client_id', client_id);

  res.render('rentals', { rentals, title: 'Historia wypożyczeń' });
});

router.get('/:rental_id/pay-deposit', async function(req, res) {
  const { rental_id } = req.params;
  const rental = await knex('rentals')
    .first()
    .where('rental_id', rental_id);
  if (rental.state !== 'RESERVED') {
    return res.redirect('/rentals');
  }

  rental.state = 'DEPOSIT_PAID';

  await knex('rentals')
    .where('rental_id', rental_id)
    .update(rental);

  res.redirect('/rentals');
});

router.get('/:rental_id/return-deposit', async function(req, res) {
  const { rental_id } = req.params;
  const rental = await knex('rentals')
    .first()
    .where('rental_id', rental_id);

  if (rental.state !== 'DEPOSIT_PAID' && rental.state !== 'CAR_RETURNED') {
    return res.redirect('/rentals');
  }

  rental.state = 'DEPOSIT_SETTLED';

  await knex('rentals')
    .where('rental_id', rental_id)
    .update(rental);

  res.redirect('/rentals');
});

router.get('/:rental_id/take-car', async function(req, res) {
  const { rental_id } = req.params;
  const rental = await knex('rentals')
    .first()
    .where('rental_id', rental_id);

  if (rental.state !== 'DEPOSIT_PAID') {
    return res.redirect('/rentals');
  }

  rental.state = 'CAR_IN_USE';

  await knex('rentals')
    .where('rental_id', rental_id)
    .update(rental);

  res.redirect('/rentals');
});

router.get('/:rental_id/return-car', async function(req, res) {
  const { rental_id } = req.params;
  const rental = await knex('rentals')
    .first()
    .where('rental_id', rental_id);

  if (rental.state !== 'CAR_IN_USE') {
    return res.redirect('/rentals');
  }

  rental.state = 'CAR_RETURNED';

  await knex('rentals')
    .where('rental_id', rental_id)
    .update(rental);

  res.redirect('/rentals');
});

module.exports = router;
