module.exports = (sequelize, Sequelize) => {
    const Nav = sequelize.define("nav", {
      text: {
        type: Sequelize.STRING
      },
      parentId:{
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      }
    });
    return Nav;
  };