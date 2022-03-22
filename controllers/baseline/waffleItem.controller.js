const db = require("../../models");
const WaffleItem = db.baseline.waffleItems;

const Op = db.baseline.Sequelize.Op;
// Create and Save a new WaffleItem
exports.create = (req, res) => {
    
    // Create a Tutorial
    const waffleItem = {
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      description: req.body.description,
      url: req.body.url,
      appOwner: req.body.appOwner,
      errorReportRoute: req.body.errorReportRoute
    };
    // Save Tutorial in the database
    WaffleItem.create(waffleItem)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Waffle Item."
        });
      });
  };

  exports.findAll2 = () => {        
    return WaffleItem.findAll()
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

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    WaffleItem.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Waffle Item."
        });
      });
  };
// Find a single Tutorial with an id
exports.findOne = (id) => {
    return WaffleItem.findByPk(id)
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
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  WaffleItem.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "WaffleItem was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete WaffleItem with id=${id}. Maybe WaffleItem was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete WaffleItem with id=" + id
      });
    });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  
};