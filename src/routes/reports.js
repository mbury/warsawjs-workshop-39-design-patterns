const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', async function(req, res, next) {
  const reportsFolder = '../../reports';
  const dir = path.resolve(__dirname, reportsFolder);
  fs.readdir(dir, (error, files) => {
    if (error) next(error);
    const reports = files.reduce((acc, file) => {
      const [filename] = file.split('.');
      const [date, department, status] = filename.split('_');
      return acc.concat([{ date, department, file, status }]);
    }, []);
    res.render('reports', { reports, title: 'Zatwierdź raporty miesięczne' });
  });
});

router.get('/:file/:action', async function(req, res, next) {
  const { file, action } = req.params;
  const status = action === 'accept' ? 1 : 2;
  const reportsFolder = '../../reports';
  const [filename, ext] = file.split('.');
  const [date, department] = filename.split('_');
  const newFilename = `${date}_${department}_${status}.${ext}`;
  const oldPath = path.resolve(__dirname, reportsFolder, file);
  const newPath = path.resolve(__dirname, reportsFolder, newFilename);
  fs.rename(oldPath, newPath, function(error) {
    if (error) next(error);
    res.redirect('/reports');
  });
});

module.exports = router;
