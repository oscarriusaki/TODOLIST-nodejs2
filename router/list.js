const { Router } = require('express');
const { getList, getLists, postList, putList, deleteList, getImage } = require('../controllers/list');
const { validar } = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');
const { fileUpload } = require('../middlewares/fileUpload');

const router = Router();
router.get('/', getList);
router.get('/:id', getLists);
router.post('/',[
    validarJWT,
    fileUpload,
    validar
], postList);
router.put('/:id', putList);
router.delete('/:id',[
    validar
], deleteList);

router.post('/image', [
    fileUpload,
    validar
], getImage)

module.exports = router;
