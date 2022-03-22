module.exports = (sequelize, Sequelize) => {
    const WaffleItem = sequelize.define("waffleItem", {
      name: {
        type: Sequelize.STRING
      },
      abbreviation:{
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      appOwner: {
        type: Sequelize.STRING
      },
      errorReportRoute: {
        type: Sequelize.STRING
      }
    });
    return WaffleItem;
  };