const db = require("../config/database");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(
  db[env].database,
  db[env].username,
  db[env].password,
  {
    host: db[env].host,
    dialect: db[env].dialect,
    operatorsAliases: false,
    sync: true,
  }
);

const Provider = {};

Provider.Sequelize = Sequelize;
Provider.sequelize = sequelize;

const UserModel = require("../models/UserModel")(sequelize, Sequelize);
const OTPModel = require("../models/OtpModel")(sequelize, Sequelize);

// relasi

Provider.UserModel = UserModel;
Provider.OTPModel = OTPModel;

module.exports = Provider;
