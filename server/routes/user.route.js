const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/users', userController.criarUsuario);
router.get('/users', userController.listUsers);
router.get('/users/:id', userController.findUserById, userController.resultado);
router.put('/users/:id', userController.findUserById, userController.atualizar);
router.delete('/users/:id'. userController.findUserById, userController.apagar);

module.exports = router;