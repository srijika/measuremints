const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../../config.json').jwd_secret;



const Authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                if (!user || !user._id) {
                    return res.send({
                        status: false,
                        message: 'Not Authorized'
                    });
                }


                if (user.deactive && user.roles != "ADMIN") {
                    return res.send({
                        status: false,
                        message: 'Your Account has been deactivated.'
                    });
                }


                req.user = user;
                next();
            });
        } else {
            return res.send({
                status: false,
                message: 'Not Authorized'
            });
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = Authenticate;