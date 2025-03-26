
// admin module validator 
const adminValidator = require('./admin/adminValidator');
const userValidator = require('./user/userValidator');
const policyValidator = require('./policy/policyValidator');

const dataValidator = {
    // admin validator
    adminValidator: adminValidator,

    // user Validator
    userValidator: userValidator,

    //policy Validator
    policyValidator: policyValidator
}

module.exports = dataValidator;
