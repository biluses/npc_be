
// admin module validator 
const adminValidator = require('./admin/adminValidator');
const userValidator = require('./user/userValidator')

const dataValidator = {
    // admin validator
    adminValidator: adminValidator,

    // user Validator
    userValidator: userValidator,
}

module.exports = dataValidator;
