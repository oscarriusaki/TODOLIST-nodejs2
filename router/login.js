const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/login');
const { validar } = require('../middlewares/validar');


const router = Router();

router.post('/',[
    check('email', 'The email is invalid').isEmail(),
    check('pas', 'The pass is required and must be more than 5 words').isLength({min: 5}),
    validar
], login)

router.post('/google',[
    check('id_token', 'google id token is necessary').not().isEmpty(),
    validar
], googleSignIn)


module.exports = router;