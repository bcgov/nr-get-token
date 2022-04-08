module.exports = (sequelize, DataTypes) => {
  const Acronym = sequelize.define('Acronym', {
    acronymId: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: {
        isUUID: 4
      }
    },
    acronym: {
      allowNull: false,
      comment: 'The application acronym',
      type: DataTypes.STRING(16),
      unique: true,
      validate: {
        is: /^(?:[A-Z]{2,}[_]?)+[A-Z]{1,}$/g
      }
    },
    name: {
      allowNull: false,
      comment: 'Name of the application acronym',
      type: DataTypes.STRING(120)
    },
    description: {
      allowNull: false,
      comment: 'Description of the application',
      type: DataTypes.STRING(255)
    },
    ministry: {
      allowNull: false,
      comment: 'Ministry the acronym is under',
      type: DataTypes.STRING(64)
    },
    contact: {
      allowNull: false,
      comment: 'Primary contact. Generally the email of either the Product Owner or Technical Lead',
      type: DataTypes.STRING(255)
    }
  }, {
    comment: 'List of all valid application acronyms',
    tableName: 'acronym'
  });
  Acronym.associate = (model) => {
    Acronym.belongsToMany(model.User, {
      foreignKey: 'acronymId',
      through: model.UserAcronym
    });
    Acronym.hasMany(model.DeploymentHistory, {
      foreignKey: 'acronymId'
    });
  };
  return Acronym;
};
