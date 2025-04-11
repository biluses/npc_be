
// admin module validator 
const adminValidator = require('./admin/adminValidator');
const userValidator = require('./user/userValidator');
const policyValidator = require('./policy/policyValidator');
const colorValidator = require('./color/colorValidator');
const sizeValidator = require('./size/sizeValidator');

const dataValidator = {
    // admin validator
    adminValidator: adminValidator,

    // user Validator
    userValidator: userValidator,

    //policy Validator
    policyValidator: policyValidator,

    //color Validator
    colorValidator: colorValidator,

    //size Validator
    sizeValidator: sizeValidator,
}

module.exports = dataValidator;
