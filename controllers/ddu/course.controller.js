const db = require("../../models");
const Course = db.ddu.courses;
const Subject = db.ddu.subjects;

const Op = db.ddu.Sequelize.Op;

// Create and Save a new WaffleItem
exports.create = (req, res) => {
    
    // Create a Tutorial
    const course = {
      name: req.body.name,      
      description: req.body.description,      
      owner: req.body.owner,
      ownerEmail: req.body.ownerEmail
    };
    // Save Tutorial in the database
    Course.create(course)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the course."
        });
      });
  };

  exports.findAll2 = () => {        
    return Course.findAll()
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
    Course.findAll({ where: condition })
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
    return Course.findByPk(id)
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
  const id = req.params.id;
  
    Course.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Course was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Course with id=${id}. Maybe Course was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Course with id=" + id
        });
      });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Course.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Course was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Course with id=" + id
      });
    });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  
};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  
};