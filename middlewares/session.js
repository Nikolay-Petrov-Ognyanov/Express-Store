const { parseToken } = require("../services/userService") // Import the parseToken function from the userService module

// Export the middleware function
module.exports = () => (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers["x-authorization"]

    // If a token is present in the headers
    if (token) {
        try {
            // Attempt to parse the token to get the payload
            const payload = parseToken(token)

            // Attach the payload to the request object
            req.user = payload
            // Attach the token to the request object
            req.token = token
        } catch (error) {
            // If there's an error while parsing the token, respond with an error message
            return res.status(200).json({ message: "Invalid authorization token." })
        }
    }

    // Call the next middleware function in the stack
    next()
}