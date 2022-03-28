const db = require("../../models");
const JBApp = db.jblib.jbApps;
const Op = db.jblib.Sequelize.Op;


exports.create = (req, res) => {

  let jbApp = {
    name: req.body.appName,    
    key: req.body.appName.replace(/ /g, '_'),
    description: req.body.description,    
    imageType: req.file.mimetype, 
    imageName: req.file.originalname,
    imageData: req.file.buffer,
    createdBy: req.signedCookies.tsUser
  };

  // Save Tutorial in the database
  JBApp.create(jbApp)
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};



// Create and Save a new WaffleItem
exports.create2 = (jbApp) => {

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
exports.findAll2 = (owner) => {        
  return JBApp.findAll({ where : { createdBy : owner}})
  //return JBApp.findAll()
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
exports.findOne = (key) => {
  //use the appname as the 
  return JBApp.findOne({ where : { key : key}})
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

// Find a single Tutorial with an id
exports.findOne2 = (req, res) => {
  const key = req.params.appKey
  console.log(key)
  JBApp.findOne({ where : { key : key}})
    .then(jbApp => {
      if (jbApp) {
        res.send(Buffer.from(jbApp.imageData.toString('base64'), "base64"));
      } else {
        res.sendFile('icon.svg', { root: `public/images/`});
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.body.id;
  
  JBApp.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            status : true, 
            message : "JB App Updated successfully"
          });
        } else {
          res.send({
            status : false,
            message: `Unable to update JBApp with id=${id}. Maybe JBApp was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          status : false,
          message: "Error updating JBApp with id=" + id
        });
      });
};


exports.delete = (req, res) => {
  const id = req.body.id;
  JBApp.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          status : true, 
            message : "JB App deleted successfully"
        });
      } else {
        res.send({
          status : false,
            message: `Unable to delete JBApp with id=${id}. Maybe JBApp was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete JB App with id=" + id
      });
    });
};