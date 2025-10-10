const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const models = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        models[model.name] = model;
    });

// Se establecene asiocioanes si es que existen?
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;