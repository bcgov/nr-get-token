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
    permissionWebade: {
      allowNull: false,
      comment: 'Flag stating whether this acronym can use WebADE',
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    permissionWebadeNrosDms: {
      allowNull: false,
      comment: 'Flag stating whether this acronym can grant access to NROS documents through DMS',
      defaultValue: false,
      type: DataTypes.BOOLEAN
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
    Acronym.hasMany(model.Lifecycle, {
      foreignKey: 'acronymId'
    });
  };
  return Acronym;
};
