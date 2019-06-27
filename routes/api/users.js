const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


router.get('/test', (req, res) => res.json({msg:"This is a test page"}));
router.get('/', (req, res) => res.send("Test in user"));


router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
    .then(user => {
        if(user) {
            return res.status(400).json({email: "already existed"});
        } else {
            const newUser = new User({
                email: req.body.email,
                handle: req.body.handle,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            const payload = {email: user.email, password: user.payload};

                            jwt.sign(payload, keys.secretOrKey, {expiresIn:3600}, (err, token) => {
                                res.json({success: true, token: "Bearer "+ token});
                            });
                        })
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(400).json({email: "This user doesn't not exist"});
            } 
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {id: user.id, name: user.name };
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    } else {
                        return res.status(400).json({password: "Incorrect password"});
                    }
                })
        })

});

router.get('/current', passport.authenticate('jwt', {session:false}), (req, res) => {
    res.json({
        id:req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
});


module.exports = router;