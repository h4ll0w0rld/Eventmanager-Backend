exports.get400 = (error, req, res, next) => {
    if (error.statusCode === 400) {
        error = new Error(error.message || "Bad request!");
        error.statusCode = 400;
    }
    next(error);
};


exports.get404 = (error, req, res, next) => {
    if (error.statusCode === 404) {
        error = new Error(error.message || "Not found!");
        error.statusCode = 404;
    }
    next(error);
};

exports.get500 = (error, req, res, next) => {
    res.status(error.statusCode || 500);
    res.json({
        error: {
            message: error.message,
            note: "error Controller"
        }
    });
};
