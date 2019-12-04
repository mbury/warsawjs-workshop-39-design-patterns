module.exports.seed = async function(knex) {
  await knex('cars').del();
  await knex('cars').insert([
    {
      car_id: 1,
      make: 'LAMBORGHINI',
      model: 'AVENTADOR LP700-4',
      price: 2235100,
    },
    {
      car_id: 2,
      make: 'FERRARI',
      model: '458 ITALIA',
      price: 1198560,
    },
    {
      car_id: 3,
      make: 'NISSAN',
      model: 'GT-R',
      price: 915000,
    },
    {
      car_id: 4,
      make: 'FORD',
      model: 'MUSTANG',
      price: 235810,
    },
    {
      car_id: 5,
      make: 'LADA',
      model: 'SAMARA',
      price: 28000,
    },
    {
      car_id: 6,
      make: 'PORSCHE',
      model: 'PANAMERA',
      price: 989000,
    },
  ]);
  await knex('users').del();
  await knex('users').insert([
    {
      user_id: 1,
      name: 'Jan Kowalski',
      mail: 'jankowalski@warsaw.js',
      isVip: 0,
    },
    {
      user_id: 2,
      name: 'Robert Kubica',
      mail: 'robertkubica@warsaw.js',

      isVip: 1,
    },
  ]);
  await knex('reports').del();
  await knex('reports').insert([
    {
      filename: '2019-01-01_HR_0.xyz',
    },
    {
      filename: '2019-01-01_SALES_0.xyz',
    },
    {
      filename: '2019-02-01_SALES_0.xyz',
    },
    {
      filename: '2019-02-01_HR_0.xyz',
    },
  ]);

  await knex('rentals').del();
};
