const Sequelize = require("sequelize");
const sequelize_baseline = new Sequelize(process.env.DATABASE_URL_BASELINE + "?sslmode=no-verify", { })
const sequelize_jblib =  new Sequelize(process.env.DATABASE_URL_JBLIB + "?sslmode=no-verify", { })
const db = {};

//Baseline Objects
const baseline_db = {};
baseline_db.Sequelize = Sequelize;
baseline_db.sequelize = sequelize_baseline;
baseline_db.waffleItems = require("./baseline/waffleItem.model.js")(sequelize_baseline, Sequelize);

//JBLIB Objects
const jblib_db ={};
jblib_db.Sequelize = Sequelize;
jblib_db.sequelize = sequelize_jblib;

jblib_db.navs = require("./jblib/nav.model.js")(sequelize_jblib, Sequelize);
jblib_db.jbApps = require("./jblib/jbApp.model.js")(sequelize_jblib, Sequelize);


db.jblib = jblib_db;
db.baseline = baseline_db;

module.exports = db;
