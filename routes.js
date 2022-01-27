'use strict';

const express = require('express');
const router = express.Router();
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/authenticate-user');
const { asyncHandler } = require('./middleware/asyncHandler');



//GET route that returns all properties and values for the currently authenticated user along with a 200 HTTP status code
router.get('/users', authenticateUser, asyncHandler(async (req ,res) => {
    const user = req.currentUser;
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        password: user.password,
        userId: user.userId
    });
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
    let courses = await Course.findAll({
        include: [
            {
                model: User,
            }
        ]
    });
    res.status(200).json(courses)

}));

// GET route that returns the corresponding course including the User associated with that course and a 200 HTTP status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let courseId = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
            }
        ]
    });
    res.status(200).json(courseId);
}));

// POST route that creates a new course, set the location header to the URI for the newly created course and reutrn a 201 HTTP status code
router.post('/courses', asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
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

// PUT route that updates the corresponding course and return a 204 HTTP status code
router.put('/courses/:id', asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        await course.update(req.body);
        res.status(204).end();
    } catch (error){
        console.log('ERROR: ', error.name);
        
        if(error.name === "SequelizeValidationError"){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// DELETE route that deletes the corresponding course and return a 204 HTTP status code 
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    try {
        await course.destroy();
        res.status(204).end();
    } catch {
        throw error();
    }
}));


module.exports = router;
