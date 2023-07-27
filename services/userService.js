const User = require("../models/User")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const secret = "jwtsecret"
const tokenBlacklist = new Set()

async function readUsers() {
    return await User.find()
}

async function register(
    username,
    password,
) {
    const existing = await User.findOne({ username }).collation({ locale: "en", strength: 2 })

    if (existing) {
        throw new Error("Username is taken.")
    } else {
        const user = await User.create({
            username,
            hashedPassword: await bcrypt.hash(password, 10),
        })

        return createToken(user)
    }
}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: "en", strength: 2 })

    if (!user) {
        throw new Error("Incorrect username or password.")
    }

    const match = await bcrypt.compare(password, user.hashedPassword)

    if (!match) {
        throw new Error("Incorrect username or password")
    }

    return createToken(user)
}

async function logout(token) {
    tokenBlacklist.add(token)
}

function createToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
    }

    return {
        _id: user._id,
        username: user.username,
        accessToken: JWT.sign(payload, secret),
        purchases: user.purchases
    }
}

function parseToken(token) {
    if (tokenBlacklist.has(token)) {
        throw new Error("Token is blacklisted")
    }

    return JWT.verify(token, secret)
}

module.exports = {
    register,
    login,
    logout,
    parseToken,
    readUsers
}