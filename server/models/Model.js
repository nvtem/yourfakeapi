const { ObjectID } = require("mongodb")

module.exports = class Model {
  _id = ''
  data = {}

  static collectionName = ''
  static db = null

  static setDB(db) {
    this.db = db
  }

  static get collection() {
    return this.db.collection(this.collectionName)
  }

  static async findById(id) {
    return await this.findOneByParams({ _id: ObjectID(id) })
  }

  static async findOneByParams(params) {
    let doc = await this.collection.findOne(params)

    if (doc) {
      let instance = new this()
      instance._id = doc._id.toString()
      instance.data = doc

      return instance
    } else {
      return null
    }
  }

  static async findManyByParams(params) {
    return this.collection.find(params).toArray()
  }

  async remove() {
    return this.constructor.collection.remove({
      _id: ObjectID(this._id)
    })
  }

  async update(data) {
    return this.constructor.collection.updateOne({ _id: ObjectID(this._id) }, { $set: data })
  }

  static async getAll() {
    return this.collection.find().toArray()
  }

  static async create(data) {
    return this.collection.insertOne(data)
  }
}