module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("jbApp", {
    name: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },    
    imageType: {
      type: DataTypes.STRING
    },
    imageName: {
      type: DataTypes.STRING
    },
    imageData: {
      type: DataTypes.BLOB,
    },
  });
  return Image;
};