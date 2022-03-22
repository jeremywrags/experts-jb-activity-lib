const db = require("../../models");
const Nav = db.ddu.navs;
const Op = db.ddu.Sequelize.Op;

// Create and Save a new WaffleItem
exports.create = (req, res) => {    
    // Create a Tutorial
    const nav = {
      text: req.body.text,      
      parentId: req.body.parentId,      
      url: req.body.url      
    };
    // Save Tutorial in the database
    Nav.create(nav)
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
    return Nav.findAll()
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


exports.findNav = () => {
  return Nav.findAll({})
    .then((navItems) => {    
      
    // sort to ensure you take care of parents befose children
    navItems = navItems.sort((i, j) => i.parentId - j.parentId)

    let result = []
    // you reduce the array
    // the accumulator is used to keep easy access to object already processed
    navItems.reduce((acc, menuItem) => {
      // create the new object
      let mi = {id: menuItem.id, text: menuItem.text, url : menuItem.url,  children: []}
      // if there is a parent
      if (menuItem.parentId) {
      // add the current object to the parent
      acc[menuItem.parentId].children.push(mi)
    } else {
      // or add the current object to the root
      result.push(mi)
    }
    // easy acces to this object
    acc[menuItem.id] = mi
    return acc
}, [])


console.log(JSON.stringify(result))


    

      
     return result;
  });
};

function convert(array){

  var arry = 
  [{ "id": "1", "Name": "abc", "parentId": "", "attr": "abc" },
   { "id": "2", "Name": "abc", "parentId": "", "attr": "abc" },
   { "id": "3", "Name": "abc", "parentId": "1", "attr": "abc" },
   { "id": "4", "Name": "abc", "parentId": "1", "attr": "abc" },
   { "id": "5", "Name": "abc", "parentId": "1", "attr": "abc" },
   { "id": "6", "Name": "abc", "parentId": "2", "attr": "abc" },
   { "id": "7", "Name": "abc", "parentId": "2", "attr": "abc" },
   { "id": "8", "Name": "abc", "parentId": "2", "attr": "abc" },
   { "id": "9", "Name": "abc", "parentId": "2", "attr": "abc" }
  
  
  ];
           
  var map = {};
  for(var i = 0; i < array.length; i++){
    var obj = array[i];
    obj.items= [];

    map[obj.id] = obj;

    var parent = obj.parentId || '-';
    if(!map[parent]){
        map[parent] = {
            items: []
        };
    }
    map[parent].items.push(obj);
  }
  return map['-'].items;
}



// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
    Nav.findAll({ where: condition })
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
    return Nav.findByPk(id)
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
  
  Nav.update(req.body, {
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

  Nav.destroy({
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