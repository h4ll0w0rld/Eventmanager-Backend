
exports.get500 = (error, req, res, next) => {
    res.status(error.statusCode || 500);
    res.json({
        error: {
            message: error.message,
            destination: error.destination || "undefined",
            note: "error Controller"
        }
    });
};
