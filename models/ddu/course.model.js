module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("course", {
      name: {
        type: Sequelize.STRING
      },
      description:{
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      },
      ownerEmail: {
        type: Sequelize.STRING
      }
    });
    return Course;
  };