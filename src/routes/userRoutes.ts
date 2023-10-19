const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.post('/signup', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/username/:username', userController.getUsersByUsername);
router.post('/ids', userController.getUsersByIds);
router.post('/login', userController.login);

module.exports = router;