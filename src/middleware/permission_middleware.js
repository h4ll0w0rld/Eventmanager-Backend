

const checkAdmin = (req, res, next) => {
    try {
        if (req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Admin privileges required");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


const checkGuest = (req, res, next) => {
    try {
        if (req.roles.guest) {
            next();
        } else {
            const error = new Error("Unauthorized: Guest privileges required");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const checkUser = (req, res, next) => {
    try {
        if (req.roles.user) {
            next();
        } else {
            const error = new Error("Unauthorized: User privileges required");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


const checkEditor = (req, res, next) => {
    try {
        if (req.roles.editor.includes(req.params.shift_category_id) || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Editor privileges required");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const checkCurrentUser = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User can access this route");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const checkCurrentUserOrEditor = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id || req.roles.editor.includes(req.params.shift_category_id) || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User or Editor can access this route");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const checkCurrentUserOrAdmin = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User or Admin can access this route");
            error.statusCode = 403;
            next(error);
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



module.exports = {
    checkAdmin,
    checkGuest,
    checkUser,
    checkEditor,
    checkCurrentUser,
    checkCurrentUserOrEditor,
    checkCurrentUserOrAdmin
}