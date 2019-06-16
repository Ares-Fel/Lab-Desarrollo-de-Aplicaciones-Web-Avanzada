const utils = require('../lib/utils')

const User = require('../models/user.js');

const exposeFields = [
    'username',
    'name',
    'email'
];

module.exports = {
    signup: (req, res, next)=>{
        var user = new User({
            ...req.body
        });
        user
            .save()
            .then(result => {
                const token = utils.generateToken({
                    _id: result['_doc']['_id'],
                    name: result['_doc']['name'],
                    username: result['_doc']['username'],
                    email: result['_doc']['email'],
                });
                const exposedData = utils.getCleanUser(result['_doc']);
                res.status(200).json({
                    message: 'User succesfully signup!',
                    data: exposedData,
                    token: token
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    },
    signin: (req, res, next)=>{
        User
            .findOne({username: req.body.username}) //<-- check username
            .select(exposeFields.join(' ')+' password')
            .exec((err, user) => {
                if(err) res.status(500).json(err);
                if(!user){
                    return res.status(401).json({
                        error: true,
                        message: 'Username or passwordd is wrong'
                    });
                }
                user.comparePassword(req.body.password)
                    .then(valid => {
                        if(!valid){
                            return res.status(401).json({
                                error: true,
                                message: 'Username or Password is wrong'
                            });
                        }
                        res.json({
                            message: 'User succesfully logged!',
                            data: user, //<-- return both user and token
                            token: utils.generateToken(user)    //<--- Generate token
                        });
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            });
    },
    refreshToken: (req, res, next)=>{
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token;
        if (!token) {
            return res.status(401).json({message: 'Must pass token'});
        }

        //Check token ehat was passed by decoding token using secret
        utils.verifyToken(token)
            .then(user => {
                //search user after token info
                User.findById({
                    '_id': user._id
                }, function(err,user){
                    if (err) throw err;

                    const exposedData = utils.getCleanUser(user['_doc']);
                    const newToken = utils.generateToken(exposedData);

                    res.status(200).json({
                        user: exposedData,
                        token: newToken
                    });
                });
            })
            .catch(err => {
                res.status(500).json(err);
            })
    },
    verifyToken: (req, res, next)=>{
        const token = req.headers['authorization'];
        if (!token) res.status(401).json({
            error: true,
            message: 'Please register log in using a valid email to submit posts'
        });
        utils.verifyToken(token)
            .then(function(user) {
                //return user using the id from w/in JWTToken
                req.user = user;    //set the user to req so other routes can use it
                next();
            })
            .catch(function(err) {
                console.log(err)
                res.status(500).json({
                    error: err
                });
            });
    },
    create: (req, res, next)=>{
        var user = new User({
            ...releaseEvents.body
        });
        user
            .save()
            .then(result => {
                res.status(200),json({
                    message: 'User succesfully created',
                    data: {
                        ...result['_doc']
                    }
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    },
    find: (req,res,next) => {
        User.find()
            .select(exposeFields.join(' '))
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    data: docs.map(doc => {
                        return {
                            ...doc['_doc']
                        };
                    })
                };
                res,status(200).json(response);
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    },
    findOne: (req,res,next)=>{
        const id = req.params.id;
        User.findById(id)
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        data: doc['_doc'],
                    });
                }else{
                    res.status(404).json({message: 'No valid entry found for prvided ID'});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    },
    update: (req,res,next) => {
        const id = req.params.id;
        let updateParams = {
            ...req.body
        };
        User.update({_id:id},{$set: updateParams})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'User update!',
                    date: result['_doc']
                });
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    },
    delete: (req,res,next)=>{
        const id = req.params.id;
        User.remove({_id:id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'User deleted!'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    }
};