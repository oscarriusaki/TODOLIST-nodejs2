const { validationResult } = require('express-validator');

const validar = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json(errors);
    }
    next();
}

module.exports = {
    validar
};