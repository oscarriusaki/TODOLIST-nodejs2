const { db } = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");

const getUsers = async (req, res)=>{
    const pg = await db;
    const sql = 'SELECT * FROM users WHERE estado = $1';
    try{
        pg.query(sql, [ true], (err, result) => {

            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                if(result.rowCount >= 1){
                    return res.status(200).json(result.rows)
                }else{
                    return res.status(400).json({
                        msg: 'There was an error during the registration'
                    })
                }
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error durin the serching the date'
        })
    }
}
const getUser=(req, res)=>{
    res.json({
        msg: 'getUser'
    })
}
const postUser = async (req, res)=>{
    try{

        const pg = await db;
        const { ... user} = req.body;

        const sql = 'SELECT * FROM USERS WHERE email = $1';
        const sql2 = 'INSERT INTO USERS (first_name, email, pas, fecha, estado, tokens) values ($1,$2,$3,$4,$5,$6)';

        pg.query(sql, [user.email], async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                if(result.rowCount === 0){

                    const yy = new Date().getFullYear();
                    const mm = new Date().getMonth()+1;
                    const dd = new Date().getDate();

                    const salt = bcryptjs.genSaltSync();
                    const password = bcryptjs.hashSync(user.pas, salt);
                    const token = await generarJWT(user.email);

                    pg.query(sql2, [user.first_name, user.email, password, (yy+"/"+mm+"/"+dd), true, token], (err, result) => {
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
                                    msg: 'successfully registrated'
                                })
                            }else{ 
                                return res.status(500).json({
                                    msg: 'there was an error during the registration'
                                })
                            }
                        }
                    })

                }else{
                    return res.status(400).json({
                        msg: 'The email exists'
                    })
                }
            }
        })

    }catch(err){
        return res.status(500).json({
            msg: 'there was and error, talk to the administration'
        })
    }
}
const putUser = async (req, res)=>{
    try{

        const pg = await db;
        const email_logueado = req.user.email;
        const { id_user , ... user } = req.body;
        const sql = 'SELECT * FROM USERS WHERE email = $1';
        const sql2 = 'UPDATE USERS SET first_name = $1, email = $2, pas = $3, tokens = $4 WHERE email = $5 and estado = $6'; 
        
        pg.query(sql, [ user.email] , async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                if(result.rowCount <= 1){
                    
                    const toke = await generarJWT(user.email);
                    const salt = bcryptjs.genSaltSync();
                    const pasGenerate = bcryptjs.hashSync(user.pas, salt);

                    if((result.rowCount === 0) || ((result.rowCount === 1)&& (result.rows[0].email === email_logueado)) ){
                        pg.query(sql2, [user.first_name, user.email, pasGenerate, toke, email_logueado, true], (err, result) => {
                            if(err){
                                return res.status(500).json({
                                    code: err.code, 
                                    name: err.name, 
                                    hint: err.hint,
                                    detail: err.detail,
                                    where: err.where,
                                    file: err.file  
                                })
                            }else{
                                if(result.rowCount === 1){
                                    
                                    req.user.first_name =  user.first_name;
                                    req.user.email = user.email;
                                    req.user.pas = pasGenerate;
                                    req.user.tokens = toke;
                                    
                                    return res.status(200).json({
                                        toke,
                                        msg: 'successfully updated'
                                    })
                                       
                                }else{
                                    return res.staus(400).json({
                                        msg: `there was an error during the updating`
                                    })
                                }
                            }

                        })

                    }else{
                        return res.status(400).json({
                            msg: `this email is no valid, already exist ${user.email}`,
                        })
                    }

                }else{
                    return res.status(400).json({
                        msg: `user not found`
                    }); 
                }
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error talk to the administration'
        })
    }   
}
const deleteUser = async (req, res)=>{
    try{
        
        const pg = await db;       
        const { email } = req.user;
        const sql = 'SELECT * FROM USERS WHERE email = $1 and estado = $2';
        const sql2 = 'UPDATE USERS SET estado = $1 WHERE email = $2';
        pg.query(sql, [ email, true], (err, result) => {
            
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

                    pg.query(sql2, [ false, email], (err, result) => {
                        
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
                                    msg: 'successfully eliminated '
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was an error during elimination'
                                })
                            }
                        }
                        
                    });

                }else{
                    return res.status(500).json({
                        msg: `user not found with ${email}`,
                    })
                }
            }

        })

    }catch(err){
        console.log(err);
        throw new Error(err)
    }
}

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
}