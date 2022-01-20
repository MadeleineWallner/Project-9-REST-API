'use strict';

const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');

// Asynchandler
function asyncHandler(cb){
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error){
            next(error);
        }
    }
}

//GET route that returns all properties and values for the currently authenticated user along with a 200 HTTP status code
router.get('/users', asyncHandler(async (req ,res) => {
    let users = await User.findAll();
    res.json(users);
}));

//POST route that creates a new user, sets the location header to '/' and return a 201 HTTP status code and no content
router.post('/users', asyncHandler(async (req ,res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch (error){
        console.log('ERROR: ', error.name);

        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Course Routes

// GET route that returns all courses including the User associated with each course and a 200 HTTP status code
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses)

}));

// GET route that returns the corresponding course including the User associated with that course and a 200 HTTP status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let courseId = await Course.findByPk(req.params.id);
    res.status(200).json(courseId);
}));

// POST route that creates a new course, set the location header to the URL for the newly created course and reutrn a 201 HTTP status code
router.post('/courses', asyncHandler(async (req, res) => {

}));

// PUT route that updates the corresponding course and return a 204 HTTP status code
router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

// DELETE route that deletes the corresponding course and return a 204 HTTP status code 
router.delete('/courses/:id', asyncHandler(async (req, res) => {

}));


module.exports = router;
