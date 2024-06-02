// Import the Schema and model functions from the mongoose package
const { Schema, model } = require("mongoose")

// Define the user schema using the Schema constructor
const userSchema = new Schema({
    // Define the username field as a string, required, and unique
    username: { type: String, required: true, unique: true },
    // Define the hashedPassword field as a string and required
    hashedPassword: { type: String, required: true },
    // Define the purchases field as an object (optional)
    purchases: { type: Object }
})

// Create an index on the username field to enforce unique values
userSchema.index({ username: 1 }, {
    // Define collation settings for the index to support case-insensitive searches
    collation: {
        locale: "en",     // Locale to use for collation
        strength: 2       // Strength to use for comparison (case and diacritic insensitive)
    }
})

// Create the User model using the userSchema
const User = model("User", userSchema)

// Export the User model for use in other parts of the application
module.exports = User