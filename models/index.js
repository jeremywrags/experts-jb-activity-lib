const Sequelize = require("sequelize");
const sequelize_baseline = new Sequelize(process.env.DATABASE_URL_BASELINE + "?sslmode=no-verify", { })
const sequelize_ddu =  new Sequelize(process.env.DATABASE_URL_DDU + "?sslmode=no-verify", { })
const db = {};

//Baseline Objects
const baseline_db = {};
baseline_db.Sequelize = Sequelize;
baseline_db.sequelize = sequelize_baseline;
baseline_db.waffleItems = require("./baseline/waffleItem.model.js")(sequelize_baseline, Sequelize);

//DDU Objects
const ddu_db ={};
ddu_db.Sequelize = Sequelize;
ddu_db.sequelize = sequelize_ddu

ddu_db.courses = require("./ddu/course.model.js")(sequelize_ddu, Sequelize);
ddu_db.subjects = require("./ddu/subject.model.js")(sequelize_ddu, Sequelize);
ddu_db.preWorks = require("./ddu/preWork.model.js")(sequelize_ddu, Sequelize);
ddu_db.navs = require("./ddu/nav.model.js")(sequelize_ddu, Sequelize);


//setup the one to many relationship between courses and subjects
ddu_db.courses.hasMany(ddu_db.subjects, { as: "Subjects"});
ddu_db.subjects.belongsTo(ddu_db.courses, {
    foreignKey: "courseId",
    as: "course"
})

//setup the one to many relationship between subject and pre works objects
ddu_db.subjects.hasMany(ddu_db.preWorks, { as: "PreWorks"});
ddu_db.preWorks.belongsTo(ddu_db.subjects, {
    foreignKey: "subjectID",
    as: "course"
})



db.ddu = ddu_db;
db.baseline = baseline_db;

module.exports = db;
