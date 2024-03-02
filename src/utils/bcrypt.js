const bcrypt = require("bcrypt");

const saltRound = 10;
exports.encrypt = (password) => {
  return bcrypt.hashSync(password, saltRound);
};

exports.decrypt = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
