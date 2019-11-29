var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));

router.get('/login/:userId', async function(req, res) {
  const user = await knex('users')
    .first()
    .where('user_id', req.params.userId);

  // eslint-disable-next-line require-atomic-updates
  req.session.user = user;
  res.redirect('/');
});

router.get('/login', async function(req, res) {
  const users = await knex('users');
  res.render('login', { users, title: 'Wybierz użytkownika' });
});

router.get('/logout', async function(req, res) {
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
