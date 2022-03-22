const db = require("../../models");
const PreWork = db.ddu.preWorks

const Op = db.ddu.Sequelize.Op;
// Create and Save a new WaffleItem

exports.create = (req, res) => {
    
    // Create a CourseSubject
    const preWork = {                 
      courseSubjectId: req.body.courseSubjectId,
      name: req.body.name, 
      description: req.body.description, 
      url
    };
    // Save Tutorial in the database
    PreWork.create(preWork)
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
    return PreWork.findAll()
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
    PreWork.findAll({ where: condition })
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
    return PreWork.findByPk(id)
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
  
  PreWork.update(req.body, {
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

  PreWork.destroy({
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