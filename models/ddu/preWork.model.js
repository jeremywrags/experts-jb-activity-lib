module.exports = (sequelize, Sequelize) => {
    const PreWork = sequelize.define("preWork", {
      name:{
        type: Sequelize.STRING
      },
      description:{
        type: Sequelize.STRING
      }, 
      materialURL:{
        type: Sequelize.STRING
      }
    });
    return PreWork;
  };