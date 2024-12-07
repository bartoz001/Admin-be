
import User from '../models/user.js';
import bcrypt from 'bcrypt';  // Import bcrypt for password hashing
import jwt from 'jsonwebtoken';  // Import jsonwebtoken for token generation
const secret = 'secretkey';
import request from '../models/request.js';


const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, secret);
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).json({ sucusss: true, message: 'User logged in successfully', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ sucusss: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging out user', error: error.message });
    }

}

const requestUser = async (req, res) => {
    const { name, email } = req.body;

    // Basic input validation
    if (!name || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        const userRequest = await request.findOne({ email });


        if (userRequest) {
            return res.status(400).json({ message: 'User already requested' });
        }
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new request({ name, email })
        await user.save();
        res.status(201).json({ sucusss: true, message: 'User request successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error request user', error: error.message });
    }
}

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;

    // Validate that id is a valid ObjectId
    

    try {
        // Check if the user exists by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the email is being updated and if it already exists
        if ( email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Prepare the updated fields (only include fields that are provided)
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true, runValidators: true } // Return the updated user and run validation
        );

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
};


export { Login, logout, requestUser ,updateUser};