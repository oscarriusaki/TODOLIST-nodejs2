const { Router } = require('express');
const { getList, getLists, postList, putList, deleteList } = require('../controllers/list');
const { validar } = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();
router.get('/', getList);
router.get('/:id', getLists);
router.post('/',[
    validarJWT,
    validar
], postList);
router.put('/:id', putList);
router.delete('/:id', deleteList);

module.exports = router;
