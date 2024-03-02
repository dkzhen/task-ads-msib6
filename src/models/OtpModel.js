"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Otp = sequelize.define(
    "otp",
    {
      otpId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "otp",
      timestamps: false,
    }
  );

  return Otp;
};
