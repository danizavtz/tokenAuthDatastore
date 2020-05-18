const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.listUsers);
router.get('/users/:id', userController.findUserById, userController.resultado);

module.exports = router;