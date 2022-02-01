'use strict';

const express = require('express');
const router = express.Router();
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/authenticate-user');
const { asyncHandler } = require('./middleware/asyncHandler');



//GET route that returns all properties and values (except 'password', 'createdAt' and 'updatedAt')  for the currently authenticated user along with a 200 HTTP status code
router.get('/users', authenticateUser, asyncHandler(async (req ,res) => {
    const user = await User.findByPk(req.currentUser.id, {
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    });
    res.status(200).json({user});
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

// GET route that returns all courses including the User associated with each course and a 200 HTTP status code. Exclude 'createdAt' and 'updatedAt'.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
            {
                model: User
            }
        ],
    });
    res.status(200).json(courses)

}));

// GET route that returns the corresponding course including the User associated with that course and a 200 HTTP status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let courseId = await Course.findByPk(req.params.id, {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
            {
                model: User,
            }
        ]
    });
    res.status(200).json(courseId);
}));

// POST route that creates a new course, set the location header to the URI for the newly created course and return a 201 HTTP status code
router.post('/courses',  authenticateUser, asyncHandler(async (req, res) => {
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
router.put('/courses/:id',  authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = await User.findByPk(req.currentUser.id);
// If the currently authenticated user is the owner of the course - update the course. If not - return a 403 http status code
    if(course.dataValues.id === user.dataValues.id){
    try {      
            const course = await Course.findByPk(req.params.id);
            await course.update(req.body);
            res.status(204).end();
    } catch (error){
        console.log('ERROR: ', error.name);
        
        if(error.name === "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
} else {
    res.status(403).json({message: "Access denied"});  
}
}
));

// DELETE route that deletes the corresponding course and return a 204 HTTP status code 
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const user = await User.findByPk(req.currentUser.id);
    // If the currently authenticated user is the owner of the course - delete it. Else - return a 403 http status code 
    if(course.dataValues.id === user.dataValues.id){
        try {
            await course.destroy();
            res.status(204).end();
        } catch {
            throw error();
        }
    } else {
        res.status(403).json({message: "Access denied"});  
    }

}));


module.exports = router;