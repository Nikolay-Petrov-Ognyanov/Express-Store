// Function to parse errors and return meaningful error messages
function parseError(error) {
    // Check if the error is an array (e.g., from express-validator)
    if (Array.isArray(error)) {
        // Map over the array and return an array of error messages
        return error.map(e => e.msg)
    } 
    // Check if the error is a Mongoose validation error
    else if (error.name === "ValidationError") {
        // Extract and return an array of error messages from the Mongoose validation error object
        return Object.values(error.errors).map(e => e.message)
    } 
    // For other types of errors, return the error message directly
    else {
        return error.message
    }
}

// Export the parseError function for use in other parts of the application
module.exports = {
    parseError
}