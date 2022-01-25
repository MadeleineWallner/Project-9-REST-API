'use strict'

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Middleware to authenticate the user
exports.authenticateUser = async (req ,res, next) => {
    let message;

    const credentials = auth(req);
    // Check if the user's credentials are available
    if(credentials) {
    // Find a user account whose email matches the user credentials.    
        const user = await User.findOne({ where: {emailAddress: credentials.name}});
        
        if(user){
    // Compare the encrypted password to the user's password from the Authorization header
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        
            if(authenticated){
                console.log(`Authentication successful for username: ${user.emailAddress}`);
            // Add the user account to the request object
                req.currentUser = user;
            } else {
                message = `Authentication failed for username: ${user.emailAddress}`
            }
        } else {
            message = `User: ${credentials.name} not found`
        }
    } else {
        message = 'Auth header not found';
    }
    if (message){
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
    } else {
        next();
    }
};