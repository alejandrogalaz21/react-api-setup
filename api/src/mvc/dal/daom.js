/***************************************************************************************
 *                           CREATE DATA ACCESS OBJECT FILE                            *
 * IN THE DATA ACCESS OBJECT (DOA) LAYER, WE CAN DEFINE THE FUNCTION WHICH IS DIRECTLY *
 *  CONNECTED TO THE DATABASE AND FETCH DATA AND SAVE DATA FROM AND TO THE DATABASE.   *
 ***************************************************************************************/

/**
 *
 * @export
 * @param {*} model
 * @returns {Object}
 */
export default function dao(model) {
  return {
    // Save a document into a collection
    create: function(data, cb) {
      // const doc = new model(data)
      return model.create(data, cb)
    },
    // Find a list of matched documents
    get: function(query, cb) {
      return model.find(query, cb)
    },
    // Find only one matched document
    getOne: function(query, cb) {
      return model.findOne(query, cb)
    },
    // Update a matched document
    update: function(query, updateData, cb) {
      return model.findOneAndUpdate(query, updateData, { new: true }, cb)
    },
    // Delete a document
    delete: function(query, cb) {
      return model.findOneAndDelete(query, cb)
    },
    // Count documents of a collection
    count: function(query, cb) {
      return model.countDocuments(query, cb)
    }
  }
}
