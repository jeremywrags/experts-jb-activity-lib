const db = require("../../models");
const JBApp = db.jblib.jbApps;
const Op = db.jblib.Sequelize.Op;

// Create and Save a new WaffleItem
exports.create = (jbApp) => {

  // Save Tutorial in the database
  JBApp.create(jbApp).then(data => {
    return data;
  }).catch(err => {
    return {
      message:
        err.message || "Some error occurred while creating the course."
    };
  });
};
exports.findAll = (req, res) => {
    
  JBApp.findAll().then(jbApps => {       
      return jbApps;
    })
    .catch(err => {
      return {
        message:
          err.message || "Some error occurred while creating the course."
      };
    });
};
// Find a singl
exports.findAll2 = () => {        
  return JBApp.findAll()
    .then(data => {
      return data;
    })
    .catch(err => {
      return {
        message:
          err.message || "Some error occurred while retrieving tutorials."
      };
    });
  };

  // Find a single Tutorial with an id
exports.findOne = (appName) => {
  return JBApp.findOne({ where : { name : appName}})
  .then(data => {
    return data;
  })
  .catch(err => {
    return {
      message:
        err.message || "Some error occurred while retrieving Config."
    };
  });
};