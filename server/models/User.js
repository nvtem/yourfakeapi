const Model = require('./Model')

module.exports = class User extends Model {
  static collectionName = 'users'
}