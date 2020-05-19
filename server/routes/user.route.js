const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/validator.user');

router.post('/users', userValidator.validationBodyRules, userValidator.checkRules, userController.criarUsuario);
router.get('/users', userController.listUsers);
router.get('/users/:id', userValidator.validationGetRules, userValidator.checkRules, userController.findUserById);
router.put('/users/:id', userValidator.validationGetRules, userValidator.validationPutRules, userValidator.checkRules, userController.atualizar);
router.delete('/users/:id', userValidator.validationGetRules, userValidator.checkRules, userController.apagar);

module.exports = router;