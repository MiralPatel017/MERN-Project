const { Router } = require('express')
const User = require('../modules/user.module')
const userRouter = Router()
const createUserServices = require('../services/signup.service')
const { generateToken } = require('../services/token.service')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')

// store in local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        // join - when spacing in the filename
        const fileName = `${Date.now()}-${`${file.originalname.split(' ').join('-')}`}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })

// get signup
userRouter.get('/signup', (req, res) => {
    res.send('Signup route')
})

// signup / create user
userRouter.post('/signup', upload.single('profileimage'), async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const userCreate = { username, email, password, role }

        if (req.file) {
            userCreate.profileimage = `./uploads/${req.file.filename}`
        }
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }



        // const user = await createUserServices.createUser({
        //     username,
        //     email,
        //     // profileimage: `./uploads/${req.file.filename}`,
        //     password,
        //     role,
        // });

        const user = await createUserServices.createUser(userCreate)
        
        const newUser = { id: user._id, username, email, profileimage: user.profileimage, role: user.role || 'user' };

        return res.status(201).json({ user: newUser, message: 'User created successfully' })
    } catch (error) {
        console.error("Signup error: ", error);
        res.status(400).json({ message: "Error creating user " });
    }
});

// signin user
userRouter.post('/signin', async (req, res) => {
    try {

        const { email, password, role = "user" } = req.body

        const user = await User.findOne({ email, role }).select('+password +role')

        if (!user) {
            return res.status(401).json({ message: "User not found Please Signup" })
        }

        const isMatch = user.comparePassword
            ? await user.comparePassword(password)
            : await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
        };

        const token = generateToken(user)

        // expire token in 1 day
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.json({ token, user: userData, message: 'User signed in successfully' })
    } catch (error) {

        console.error("Signin error: ", error)

        res.status(500).json({ message: "Server error" })
    }
})

// admin signin
userRouter.post('/admin-signin', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email, role: "admin" }).select('+password +role ')

        if (!user) {
            return res.status(401).json({ message: "Admin not found !" })
        }

        const isMatch = user.comparePassword
            ? await user.comparePassword(password)
            : await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            profileimage: user.profileimage,
            role: user.role || 'admin'
        }

        const token = generateToken(user)

        // cookie expire in a day
        res.cookie("Token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',   
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.send({ token, user: userData })

    } catch (error) {

        console.error("Signin error: ", error)

        res.status(500).json({ message: "Server error" })
    }

})

// update put user
userRouter.put('/update-user/:id', upload.single('profileimage'), async (req, res) => {
    try {
        const { id } = req.params;

        const { username, email } = req.body;

        const updateUser = { username, email }

        if (req.file) {
            updateUser.profileimage = `/uploads/${req.file.filename}`
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateUser, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Update error: ", error);
        res.status(500).json({ message: "Error updating user: " + error.message });
    }
});

// delete user
userRouter.delete('/delete-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            // console.log(req.params)
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Delete error: ", error);
        res.status(500).json({ message: "Error deleting user: " + error.message });
    }
})

// get all user
userRouter.get('/get-all-user', async (req, res) => {

    try {

        const users = await User.find().select('-password');
        return res.status(200).json(users);

    } catch (error) {

        console.error("Get all users error: ", error);

        res.status(500).json({
            message: "Error getting all users: " + error.messag
        })
    }
})

// get user by id
userRouter.get('/get-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('username email profileimage role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get user by id error: ", error);
        res.status(500).json({ message: "Error getting user by id: " + error })
    }
})

// update admin details
userRouter.put('/update-admin/:id', upload.single('profileimage'), async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;
        const updateAdmin = { username, email }

        if (req.file) {
            updateAdmin.profileimage = `/uploads/${req.file.filename}`
        }
        const updatedUser = await User.findByIdAndUpdate(id, updateAdmin, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Update admin details error: ", error);
        res.status(500).json({ message: "Error updating admin details: " + error })
    }

})

// get admin details
userRouter.get('/get-admin', async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }).select('username email profileimage profileimage role');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).send(admin);
    } catch (error) {
        console.error("Get admin details error: ", error);
        res.status(500).json({ message: "Error getting admin details: " + error })
    }
})

module.exports = userRouter