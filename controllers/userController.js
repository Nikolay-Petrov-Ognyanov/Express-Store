const User = require("../models/User") // Import the User model
const userService = require("../services/userService") // Import user services
const userController = require("express").Router() // Create a router instance from Express
const { body, validationResult } = require("express-validator") // Import validation functions from express-validator
const { parseError } = require("../utility/parser") // Import a custom error parsing utility

// Route to get all users
userController.get("/", async (req, res) => {
    try {
        // Attempt to read users using user service
        const users = await userService.readUsers()

        // Respond with users data in JSON format
        res.status(200).json({ users })
    } catch (error) {
        // If there's an error, parse the error message
        const message = parseError(error)

        // Respond with the parsed error message
        res.status(200).json({ message })
    }
})

// Route to register a new user with validation checks
userController.post("/register",
    // Validate the username: must be between 2 and 20 characters
    body("username").isLength({ min: 2, max: 20 }).withMessage(
        "Username must be between 2 and 20 characters long."
    ),
    // Validate the password: must be at least 5 characters long
    body("password").isLength({ min: 5 }).withMessage(
        "Password must be at least 5 characters long."
    ),
    async (req, res) => {
        try {
            // Extract validation errors from the request
            const { errors } = validationResult(req)

            // If there are validation errors, throw them
            if (errors.length > 0) throw errors

            // Destructure the username and password from the request body
            const { username, password } = req.body

            // Register the user using user service and obtain a token
            const token = await userService.register(username, password)

            // Respond with the token in JSON format
            res.status(200).json(token)
        } catch (error) {
            // If there's an error, parse the error message
            const message = parseError(error)

            // Respond with the parsed error message
            res.status(200).json({ message })
        }
    }
)

// Route to log in a user
userController.post("/login", async (req, res) => {
    try {
        // Destructure the username and password from the request body
        const { username, password } = req.body

        // Log in the user using user service and obtain a token
        const token = await userService.login(username, password)

        // Respond with the token in JSON format
        res.status(200).json(token)
    } catch (error) {
        // If there's an error, respond with the error message
        res.status(200).json({ message: error.message })
    }
})

// Route to log out a user
userController.post("/logout", async (req, res) => {
    try {
        // Extract the token from the request body
        const token = req.body.accessToken

        // Log out the user using user service
        await userService.logout(token)

        // Respond with no content status
        res.status(204).end()
    } catch (error) {
        // If there's an error, respond with the error message
        res.status(200).json({ message: error.message })
    }
})

// Route to update a user
userController.put("/:userId", async (req, res) => {
    try {
        // Extract the user data from the request body
        const user = req.body

        // Find the user by ID and update their data
        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, user)

        // Respond with the updated user data in JSON format
        res.status(200).json(updatedUser)
    } catch (error) {
        // If there's an error, respond with the error message
        res.status(200).json({ message: error.message })
    }
})

// Export the user controller
module.exports = userController