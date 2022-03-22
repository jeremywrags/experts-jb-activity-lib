module.exports = (sequelize, Sequelize) => {
    const Subject = sequelize.define("subject", {      
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
    return Subject;
  };
