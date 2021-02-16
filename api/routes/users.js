const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const usersControllers = require('../controllers/usersControllers')

router.post('/signup', usersControllers.users_create_user)

router.post('/signin', usersControllers.users_login_user)

router.delete('/:userId',checkAuth, usersControllers.users_delete_user)

module.exports = router