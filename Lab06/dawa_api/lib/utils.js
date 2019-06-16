const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: user => {
        //
        //
        //
        const u = {
            _id: user._id,
            name: user.name,
            username: user,username,
            email: user.email
        };
        return token = jwt.sign(u, process.env.JWT_SECRET, {
            expiresIn: 60*60*24 //expira en 24 hrs
        });
    },
    verifyToken: token => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
                if (err){
                    reject(err);
                }
                //return user using the id from w/in JWTToken
                resolve(user);
            });
        });
    },
    getCleanUser: user => {
        const { password, age, createAt, updateAt, __v, ...exposedData } = user;
        return exposedData;
    }
}