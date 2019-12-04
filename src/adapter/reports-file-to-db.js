const knex = require('knex')(require('../../knexfile'));

const fs = {};

fs.readdir = (filename, callback) => {
  knex('reports')
    .select('filename')
    .then(rows => {
      const files = rows.map(row => {
        return row.filename;
      });
      callback && callback(null, files);
    })
    .catch(error => {
      return callback && callback(error);
    });
};

fs.rename = (oldPath, newPath, callback) => {
  const oldFileName = extractFileName(oldPath);
  const newFileName = extractFileName(newPath);
  knex('reports')
    .where('filename', oldFileName)
    .update({ filename: newFileName })
    .then(() => {
      callback && callback(null);
    })
    .catch(error => {
      return callback && callback(error);
    });
};

function extractFileName(path) {
  return path.replace(/^.*[\\/]/, '');
}

module.exports = fs;
