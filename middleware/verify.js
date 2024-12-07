import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const secret = 'secretkey';

const isAdmin = async (req, res, next) => {
    try {
        // Get the token from the 'token' cookie
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify the token and decode it
        const decoded = jwt.verify(token, secret);

        // Check if userId exists in the decoded token payload
        if (!decoded.userId) {
            return res.status(400).json({ msg: 'Invalid token, missing userId' });
        }

        // Fetch the user from the database based on the decoded userId
        const user = await User.findById(decoded.userId);

        // Check if the user exists and has the 'admin' role
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'You do not have admin privileges' });
        }

        // Attach the user to the request object for use in further route handlers
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific error types
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Log the full error and return a server error message
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export { isAdmin };

