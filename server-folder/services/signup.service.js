const User = require('../modules/user.module')

const bcrypt = require('bcrypt')

const SALT = 10

const multer = require('multer')

// store in local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })


async function createUser(userData) {
    const salt = await bcrypt.genSalt(SALT)

    const { username, email, password, role, profileimage } = userData

    if (!password || !username || !email) { throw new Error('All is required') }

    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        email,
        password: hashedPassword,
        profileimage,
        role
    })
    return user.save()
}

module.exports = { createUser } 