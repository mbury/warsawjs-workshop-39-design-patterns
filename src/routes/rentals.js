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

module.exports = router;
