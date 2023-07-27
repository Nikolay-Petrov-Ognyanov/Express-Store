const User = require("../models/User")
const userService = require("../services/userService")
const userController = require("express").Router()
const { body, validationResult } = require("express-validator")
const { parseError } = require("../utility/parser")

userController.get("/", async (req, res) => {
    try {
        const users = await userService.readUsers()

        res.status(200).json({ users })
    } catch (error) {
        const message = parseError(error)

        res.status(200).json({ message })
    }
})

userController.post("/register",
    body("username").isLength({ min: 2, max: 20 }).withMessage(
        "Username must be between 2 and 20 characters long."
    ),
    body("password").isLength({ min: 5 }).withMessage(
        "Password must be at least 5 characters long."
    ),
    async (req, res) => {
        try {
            const { errors } = validationResult(req)

            if (errors.length > 0) throw errors

            const {
                username,
                password,
            } = req.body

            const token = await userService.register(
                username,
                password,
            )

            res.status(200).json(token)
        } catch (error) {
            const message = parseError(error)

            res.status(200).json({ message })
        }
    }
)

userController.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await userService.login(username, password)

        res.status(200).json(token)
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
})

userController.post("/logout", async (req, res) => {
    try {
        const token = req.body.accessToken

        await userService.logout(token)

        res.status(204).end()
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
})

userController.put("/:userId", async (req, res) => {
    try {
        const user = req.body
        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, user)

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
})

module.exports = userController