const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../middleware/nodemailer');

exports.signup = async (req, res) => {
    let data = req.body;
    
    let payload = {
        email: data.email, 
        username: data.username
    };

    let secretKey = process.env.JWT_SECRET + data.email;

    let activationCode = jwt.sign(payload, secretKey);

    let user = new User(data);
    try {
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(data.password, salt);
        user.activationCode = activationCode;    

        let savedUser = await user.save();
        res.status(200).send(savedUser);
    } catch (err) {
        res.status(500).send('compte existant !! ')
    }

    sendConfirmationEmail(user.name, user.email, user.activationCode);
};

exports.verifyUser = async (req, res) => {
    try {
        // nlawej ken lcode etheka mawjoud walle (lcompte fama walle)
        const user = await User.findOne({ activationCode: req.params.activationCode });

        if (!user) {
            return res.status(400).send('Invalid activation code!');
        }
        if (user.isActive) {
            return res.status(400).send('Votre compte est déjà actif!');
        }

        user.isActive = true;
        await user.save(); // tsajel luser fl mongo

        res.status(200).send({
            message: "Votre compte est activé avec succès!",
        });
    } catch (err) {
        // erreuret
        res.status(500).send({
            message: "An error occurred while verifying the user.",
            error: err.message,
        });
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
                if (valid && user && !user.isActive) {
                    return res.status(400).send("Verifier votre mail pour l'activation de compte (check spam)");

                }
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

exports.verifyToken = (req, res) => {
    const token = req.body.token;
    
    if (token) {
        const decode = jwt.verify(token, '123456789');
        res.status(200).json({
            login: true,
            data: decode,
            isAdmin: decode.role === 'admin'
        });
    } else {
        res.status(400).json({
            login: false,
            data: 'error'
        });
    }
}

