const jwt = require('jsonwebtoken');

const generarJWT = (email = '') => {
    return new Promise((resolve, reject) =>{
        const payload = {email};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '920s',
        },(err, token) => {
            if(err){
                reject('there was an error during the genering the token', err);
            }else{
                resolve(token);
            }
        })
    })
}

module.exports = {
    generarJWT,
}