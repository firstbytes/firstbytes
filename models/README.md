# Models

## Strategic

 - Models should be *skinny*
 - Logic for dealing with models should be grouped as services (see /services)
 - Methods on models still have their place but should be added judiciously

## Tactical

 - Currently use Mongoose for ODB
 - Most standard models should use Mongoose for now
 - More specialized things (like revisions) may use separate types of backends in the future (e.g. git, AWS, GridFS, etc.)
 - All models belong in their own file / module
 - Modules containing a model built with mongoose should export one function (constructor) with the same name as the model (e.g. in project.js we `exports = new mongoose.model("Project", schema);`)
