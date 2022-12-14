const { response } = require("express");
const { db } = require("../database/config");
const bcryptjs = require('bcryptjs');
const e = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res = response) => {
    try{

        const { email, pas} = req.body;
        const pg = await db;
        const sql = 'SELECT * FROM USERS WHERE email = $1 and estado = $2';

        pg.query(sql, [ email, true], async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                });
            }else{
                if(result.rowCount === 1){
                    
                    const passwordVerify = bcryptjs.compareSync(pas, result.rows[0].pas);
                    if(passwordVerify){

                        const token = await generarJWT(email);
                        const sql = 'UPDATE USERS SET tokens =$1 WHERE email = $2';
                        pg.query(sql, [ token, email], (err, result) => {
                            if(err){
                                return res.stautus(500).json({
                                    code: err.code, 
                                    name: err.name, 
                                    hint: err.hint,
                                    detail: err.detail,
                                    where: err.where,
                                    file: err.file
                                })
                            }else{
                                if(result.rowCount === 1){

                                    return res.status(200).json({
                                        msg: 'successfully logged',
                                        token
                                    })

                                }else{
                                    return res.status(400).json({
                                        msg: 'there was an error during generating and registered token'
                                    })
                                }
                            }
                        })

                    }else{
                        return res.status(404).json({
                            msg: `The password is incorrect`
                        })
                    }

                }else{
                    return res.status(404).json({
                        msg: `The user with email ${email} dosen't found`,
                    });
                }
            }
        });
    }catch(err){
        console.log(err);
        return res.static(401).json({
            msg: 'Error talk with the administration' 
        })
    }
}

const googleSignIn = async (req, res= response) => {
    const {id_token} = req.body;

    try{
        const {nombre, img, correo} = await googleVerify(id_token);
        
        const token = await generarJWT();
        const pg = await db;
        const sql = 'SELECT * FROM USERS WHERE email = $1';
        const sql2 = 'INSERT INTO USERS (first_name, email, pas,  fecha, estado, tokens) values ($1,$2,$3,$4,$5,$6)';
        const yy = new Date().getFullYear();
        const mm = new Date().getMonth() + 1;
        const dd = new Date().getDate();
   
        pg.query(sql, [ correo], ( err, result) => {

            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                });
            }else{
                if(result.rowCount === 1){
                    if(result.rows[0].estado){
                        const sqlUpdate = 'UPDATE USERS tokens = $1 WHERE email = $2';
                        pg.query(sqlUpdate , [token, result.rows[0].email], (err, result) => {
                            if(err){
                                return res.status(500).json({
                                    code: err.code, 
                                    name: err.name, 
                                    hint: err.hint,
                                    detail: err.detail,
                                    where: err.where,
                                    file: err.file
                                });
                            }else{
                                if(result.rowCount === 1){
                                    return res.status(200).json({
                                        correo: correo,
                                        msg: 'User logged',
                                        token
                                    })
                                }else{
                                    return res.status(404).json({
                                        msg: `there was an error during the update the token`
                                    })
                                }
                            }
                        })
                    }else{
                        return res.status(404).json({
                            msg: 'User not found or eliminated'
                        });
                    }
                }else{
                    const salt = bcryptjs.genSaltSync();
                    const password = bcryptjs.hashSync('password', salt);
                    pg.query(sql2, [nombre, correo, password, (yy+"/"+mm+"/"+dd), true, token], (err, result) => {
                        if(err){
                            return res.status(500).json({
                                code: err.code, 
                                name: err.name, 
                                hint: err.hint,
                                detail: err.detail,
                                where: err.where,
                                file: err.file
                            });
                        }else{
                            if(result.rowCount === 1){
                                return res.status(200).json({
                                    correo: correo,
                                    msg: 'successfully logged an registered',
                                    token
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was and error during the registration with google'
                                })
                            }
                        }
                    });
                }
            }
        })

    }catch(err){
        return res.status(400).json({
            ok: false,
            msg: 'the token cannot verify'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}