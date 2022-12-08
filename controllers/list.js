const { response, json } = require("express");
const { db } = require("../database/config");
const path = require('path');

const getList = async (req, res= response) =>{

    const pg = await db;
    const sql = 'SELECT * FROM list WHERE estado = $1 order by id_list desc';

    pg.query(sql, [ true], (err, result) => {
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
            if(result.rows.length >= 1) {
                return res.status(200).json(
                    result.rows
                )
            }else{
                return res.status(404).json({
                    msg: `there aren't lists`
                })
            }
        }
    });
}
const getLists = async( req, res= response) =>{
    
    const pg = await db;
    const { id } = req.params;

    const sql = 'SELECT * FROM list WHERE id_list = $1 and estado = $2';
    pg.query(sql, [id, true] , (err, result) => {
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
            console.log(result);
            if(result.rowCount === 1){
                return res.status(200).json(result.rows)
            }else{
                return res.status(404).json({
                    msg: `There's not list with the id ${id}`
                })
            }
        }
    })  
}
const postList = async (req, res= response) =>{
    console.log(req.file, 'file');
    console.log(req.body['characters'], 'body');
    console.log(req.body['superhero'], 'body');
    const fileDirectory = req.file.filename;
    console.log(fileDirectory);
    const pg = await db;
    const sql = 'INSERT INTO list (id_user, title, description, fecha, done, estado, img) values ($1,$2,$3,$4,$5,$6,$7)';

    const idLogueado = req.user.id_user;
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() +1;
    const dd = new Date().getDate();

    pg.query(sql, [idLogueado, req.body['characters'], req.body['superhero'], (yy+"/"+mm+"/"+dd), false, true, fileDirectory], (err, result) => {
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
            if(result.rowCount === 1) {
                return res.status(200).json({
                    msg: 'successfully registered'
                })
            }else{
                return res.status(400).json({
                    msg: 'there was an error during the registration'
                })
            }
        }
    });
}
const putList = async (req, res= response) =>{
    const pg = await db;
    const { id } = req.params;
    const { ... rest } = req.body;
    const sql = 'UPDATE list SET title = $1 , description = $2 WHERE id_list = $3';

    pg.query(sql, [ rest.title, rest.description, id], (err, result) => {
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
                    msg: 'successfully updated'
                });
            }else{
                return res.status(400).json({
                    msg: `there was an error during the updating`
                });
            }
        }
    }); 
}
const deleteList = async (req, res= response) =>{
    const pg = await db;
    const { id } = req.params;
    const sql = 'UPDATE LIST SET estado = $1 WHERE id_list = $2';
    pg.query(sql, [false, id] , (err, result) => {
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
                return res.status(200).json({
                    msg: 'successfully eliminated'
                })
            }else{
                return req.status(400).json({
                    msg: 'There was an error during the elimintaion'
                })
            }
        }
    })
}

const getImage = async ( req, res = response) => {

/*   const pg = await db;
     
    const type = req.file.mimetype;
    const name = req.file.originalneme;
    const data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filesname));
    console.log(req.file);
    const image = req.file;
    console.log(image); */
    console.log(',,,,,,,,,,,,,')
    console.log((__dirname, '../images/' + req.file.filesname))
    console.log(req.file.originalname);
    console.log(req.file.filesname);
    console.log(',,,,,,,,,,,,,')
    console.log(req.file);
    console.log(',,,,,,,,,,,,,')
    console.log(__dirname)

}
module.exports = {
    getList,
    getLists,
    postList,
    putList,
    deleteList,
    getImage
}
