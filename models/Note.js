var mongoose = require("mongoose");
//var Note = require("./Note");//
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // `title` is of type String
  body: {
      type: String,
  }, 
      article: {
          type: Schema.Types.ObjectId,
          ref: "Article"
      }
  
  // `body` is of type String
  
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
