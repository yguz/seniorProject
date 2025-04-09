const { User } = require('./user');
const { Comment } = require('./comment');
const { LikedRecipe } = require('./likedRecipe');

const initializeAssociations = () => {
  // User-Comment associations
  Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    targetKey: 'id',
    constraints: true
  });

  User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments',
    sourceKey: 'id',
    constraints: true
  });

  // User-LikedRecipe associations
  LikedRecipe.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    targetKey: 'id',
    constraints: true
  });

  User.hasMany(LikedRecipe, {
    foreignKey: 'userId',
    as: 'likedRecipes',
    sourceKey: 'id',
    constraints: true
  });

  console.log('Associations initialized');
};

module.exports = { initializeAssociations }; 