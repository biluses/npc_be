// admin module validator 
const adminValidator = require('./admin/adminValidator');
const userValidator = require('./user/userValidator');
const policyValidator = require('./policy/policyValidator');
const colorValidator = require('./color/colorValidator');
const sizeValidator = require('./size/sizeValidator');
const productValidator = require('./product/productValidator');

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

    //product Validator
    productValidator: productValidator,
}

module.exports = dataValidator;
