// Import the User model from the models directory
const User = require("../models/User")
// Import bcrypt for password hashing and comparison
const bcrypt = require("bcrypt")
// Import jsonwebtoken for token creation and verification
const JWT = require("jsonwebtoken")

// Define a secret key for JWT signing and verification
const secret = "jwtsecret"
// Create a set to store blacklisted tokens
const tokenBlacklist = new Set()

// Function to retrieve all users from the database
async function readUsers() {
    return await User.find()
}

// Function to register a new user
async function register(username, password) {
    // Check if a user with the same username already exists (case-insensitive)
    const existing = await User.findOne({ username }).collation({ locale: "en", strength: 2 })

    if (existing) {
        // If the username is taken, throw an error
        throw new Error("Username is taken.")
    } else {
        // Create a new user with hashed password and default purchases
        const user = await User.create({
            username,
            hashedPassword: await bcrypt.hash(password, 10),
            purchases: {
                fruits: 0,
                vegetables: 0,
                grains: 0,
                beans: 0,
                mushrooms: 0,
            }
        })

        // Return a token for the newly created user
        return createToken(user)
    }
}

// Function to login an existing user
async function login(username, password) {
    // Find the user by username (case-insensitive)
    const user = await User.findOne({ username }).collation({ locale: "en", strength: 2 })

    if (!user) {
        // If the user does not exist, throw an error
        throw new Error("Incorrect username or password.")
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.hashedPassword)

    if (!match) {
        // If the passwords do not match, throw an error
        throw new Error("Incorrect username or password")
    }

    // Return a token for the authenticated user
    return createToken(user)
}

// Function to logout a user by blacklisting their token
async function logout(token) {
    tokenBlacklist.add(token)
}

// Function to create a token for a user
function createToken(user) {
    // Define the payload for the JWT
    const payload = {
        _id: user._id,
        username: user.username,
    }

    // Return an object containing the user details and a signed JWT
    return {
        _id: user._id,
        username: user.username,
        accessToken: JWT.sign(payload, secret),
        purchases: user.purchases
    }
}

// Function to parse and verify a token
function parseToken(token) {
    if (tokenBlacklist.has(token)) {
        // If the token is blacklisted, throw an error
        throw new Error("Token is blacklisted")
    }

    // Verify the token and return the decoded payload
    return JWT.verify(token, secret)
}

// Export the functions for use in other parts of the application
module.exports = {
    register,
    login,
    logout,
    parseToken,
    readUsers
}