// Import required modules
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const trim = require("./middlewares/trim")
const session = require("./middlewares/session")
const userController = require("./controllers/userController")

// Define the MongoDB connection string
const connectionString = "mongodb://127.0.0.1:27017/store"

// Call the start function to initialize the server
start()

// Async function to start the server
async function start() {
    // Connect to the MongoDB database
    await mongoose.connect(connectionString)

    console.log("Database connected.")

    // Create an Express application
    const app = express()

    // Middleware to parse JSON requests
    app.use(express.json())
    // Middleware to enable Cross-Origin Resource Sharing
    app.use(cors())
    // Custom middleware to trim whitespace from request bodies
    app.use(trim())
    // Custom middleware to handle user sessions
    app.use(session())

    // Define a simple route for the root URL
    app.get("/", (req, res) => {
        res.json({ message: "Hello" })
    })

    // Use the userController for routes starting with /users
    app.use("/users", userController)

    // Start the server and listen on port 3030
    app.listen(3030, () => console.log("Server started."))
}