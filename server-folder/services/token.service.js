const JWT = require('jsonwebtoken');

const secret = 'M!R@l'

function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
    const token = JWT.sign(payload, secret, { expiresIn: '1h' })
    console.log(token)
    return token
}

module.exports = {
    generateToken
}