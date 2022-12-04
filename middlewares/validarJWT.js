const { response } = require("express");
const jwt = require('jsonwebtoken');
const { db } = require("../database/config");

const validarJWT = async (req, res = response, next) => {
    
    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg: 'No se envio el token'
        })
    }

    try{

        const pg = await db;
        const sql = 'SELECT * FROM USERS WHERE email = $1 and estado = $2';
        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        pg.query(sql, [ email, true], (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file,                    
                })
            }else{
                if(result.rowCount === 1){
                    req.user = result.rows[0];
                    console.log(req.user);
                    next();

                }else{
                    return res.status(404).json({
                        msg: `no user with email ${email}`
                    })
                }
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'Token no valid or expired'
        })
    }
}

module.exports = {
    validarJWT
};