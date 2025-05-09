const generateResponse = (req, res, statusCode, success, message, data = {}) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
};

module.exports = {
    generateResponse
}; 