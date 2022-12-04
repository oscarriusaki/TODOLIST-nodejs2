const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controllers/user');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validarJWT');
const { validar } = require('../middlewares/validar');

const router = Router();

router.get('/', [
    // check(),
], getUsers);
router.get('/:id',[
    check('id', 'The id is invalid').isNumeric(),
    validar
], getUser);
router.post('/',[
    check('first_name', 'The name is required').not().isEmpty(),
    check('email', 'The email is invalid').isEmail(),
    check('pas', 'the pas required and must be a more than 5 words').isLength({min: 5}),
    validar
], postUser);
router.put('/',[
    validarJWT,
    check('first_name', 'the name is required').not().isEmpty(),
    check('email', 'The email is invalid').isEmail(),
    check('pas', 'The password is invalid').isLength({min: 5}),
    validar
], putUser);
router.delete('/',[
    validarJWT,
    validar
], deleteUser);

module.exports = router;

