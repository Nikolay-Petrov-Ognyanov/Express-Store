// Export the middleware function
module.exports = () => (req, res, next) => {
    // Iterate over each key in the request body
    for (let key in req.body) {
        // Check if the value associated with the key is a string
        if (typeof req.body[key] === "string") {
            // Trim whitespace from the string value
            req.body[key] = req.body[key].trim()
        }
    }

    // Call the next middleware function in the stack
    next()
}