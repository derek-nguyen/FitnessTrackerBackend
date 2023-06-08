/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    getPublicRoutinesByUser
} = require('../db')

// POST /api/users/register

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    const existingUser = await getUserByUsername(username);

    console.log('Existing user', existingUser)

    try {

        if (existingUser) {
            res.status(409).send({
                error: `A user with the username ${username} already exists.`,
                message: `User ${username} is already taken.`,
                name: 'UsernameExistsError',
            });

        } else if (password.length < 8) {
            res.status(409).send({
                error: `Password must be at least 8 characters long.`,
                message: `Password Too Short!`,
                name: 'PasswordLengthError',
            });

        } else {
            const newUser = await createUser({
                username,
                password
            });
            console.log('New user created', newUser)

            const response = {
                "message": 'Successfully created user!',
                "token": 'random token',
                "user": newUser
            }
            res.send(response);
        }

    } catch ({ name, message }) {
        next({ name, message })
    }


})

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
