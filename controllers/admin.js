import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
const secret = 'secretkey';
import Request from '../models/request.js';
import { v4 as uuidv4 } from 'uuid';

const getuser = async (req, res) => {
    // console.log("hello")
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
}

const getadmin = async (req, res) => {
    try {
        const admin = await User.find({ role: 'admin' });
        res.status(200).json(admin);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting admin', error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log(user)
        await User.findByIdAndDelete(userId);

        // Send success response after deletion
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        // Provide a structured error message without exposing sensitive data
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

const createuser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userexit = await User.findOne({ email });
        if (userexit) {
            return res.status(403).json({ message: 'User already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(200).json({ message: 'User created successfully', user });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

const switchadmin = async (req, res) => {
    const id = req.params.userId
    const { role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded.userId) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        const currentUser = await User.findById(decoded.userId);
        if (currentUser._id.toString() === id) {
            return res.status(401).json({ msg: 'You can not change your self' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
}

const getrequest = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting requests', error: error.message });
    }
}

const deleterequest = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await Request.findByIdAndDelete(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting request', error: error.message });
    }
}


const acceptrequest = async (req, res) => {
    const id = req.params.id;

    try {
        // Find request by ID
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Generate a random secure password (or email user to set their own)
        const generatedPassword = uuidv4(); 
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Create a new user based on the request details
        const user = new User({
            name: request.name,
            email: request.email,
            password: hashedPassword,
            role: 'user',
        });

        await user.save();

        // Delete the request after successfully creating the user
        await Request.findByIdAndDelete(id);

        res.status(200).json({ 
            message: 'Request accepted successfully',
            user : user,
            userId: user._id,
            temporaryPassword: generatedPassword, // Send via email instead in production
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Error accepting request', 
            error: error.message 
        });
    }
};

export { getuser, deleteUser, createuser, acceptrequest, getadmin, switchadmin, deleterequest, getrequest };



