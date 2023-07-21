const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const trim = require("./middlewares/trim")
const session = require("./middlewares/session")
const userController = require("./controllers/userController")

const connectionString = "mongodb://127.0.0.1:27017/auction"

start()

async function start() {
    await mongoose.connect(connectionString)

    console.log("Database conntected.")

    const app = express()

    app.use(express.json())
    app.use(cors())
    app.use(trim())
    app.use(session())

    app.get("/", (req, res) => {
        res.json({ message: "Hello" })
    })

    app.use("/users", userController)

    app.listen(3030, () => console.log("Server started."))
}