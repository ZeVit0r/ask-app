const Sequelize = require("sequelize");

const connection = new Sequelize("questions", "root", "1234567", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
