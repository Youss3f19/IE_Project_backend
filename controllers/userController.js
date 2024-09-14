const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    let data = req.body;
    if (!data.password) {
        return res.status(400).send('Password is required!');
    }

    let user = new User(data);
    try {
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(data.password, salt);

        let savedUser = await user.save();
        res.status(200).send(savedUser);
    } catch (err) {
        res.status(500).send('Error occurred: ' + err.message);
    }
};

exports.login = (req, res) => {
    let data = req.body;
    User.findOne({ email: data.email })
        .then((user) => {
            if (!user) {
                return res.status(400).send('Mail invalid!');
            }
            bcrypt.compare(data.password, user.password, (err, valid) => {
                if (err) return res.status(500).send('Error occurred: ' + err.message);
                if (!valid) return res.status(400).send('Password invalid!!');

                let payload = {
                    _id: user._id,
                    email: user.email,
                    fullname: user.name + ' ' + user.lastname,
                    role: user.role
                };
                let token = jwt.sign(payload, '123456789');
                res.status(200).send({ mytoken: token });
            });
        })
        .catch((err) => {
            res.status(400).send('Error occurred: ' + err.message);
        });
};

exports.getAllUsers = (req, res) => {
    User.find({})
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

exports.getUserById = (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

exports.getUserByEmail = (req, res) => {
    let mail = req.params.email;
    User.findOne({ email: mail })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};
