function parseError(error) {
    if (Array.isArray(error)) {
        return error.map(e => e.msg)
    } else if (error.name === "ValidationError") {
        return Object.values(error.errors).map(e => e.message)
    } else {
        return error.message
    }
}

module.exports = {
    parseError
}