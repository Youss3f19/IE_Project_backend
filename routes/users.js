const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);
router.get('/userbyid/:id', userController.getUserById);
router.get('/userbyemail/:email', userController.getUserByEmail);

module.exports = router;
