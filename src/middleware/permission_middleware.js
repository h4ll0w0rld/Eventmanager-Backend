const handleError = require("../services/error_service").handleErrors;

const checkAdmin = (req, res, next) => {
    try {
        if (req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Admin privileges required");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}


const checkGuest = (req, res, next) => {
    try {
        if (req.roles.guest || req.roles.admin || req.roles.user) {
            next();
        } else {
            const error = new Error("Unauthorized: Guest privileges required");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}

const checkUser = (req, res, next) => {
    try {
        if (req.roles.user || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: User privileges required");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}


const checkEditor = (req, res, next) => {
    try {
        if (req.roles.editor.includes(parseInt(req.params.shift_category_id)) || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Editor privileges required");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}

const checkCurrentUser = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User can access this route");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}

const checkCurrentUserOrEditor = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id || req.roles.editor.includes(parseInt(req.params.shift_category_id)) || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User or Editor can access this route");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
    }
}

const checkCurrentUserOrAdmin = (req, res, next) => {
    try {
        if (req.currentUserId == req.params.user_id || req.roles.admin) {
            next();
        } else {
            const error = new Error("Unauthorized: Only the User or Admin can access this route");
            error.statusCode = 403;
            next(handleError(error, "permissionMiddleware"));
        }
    } catch (error) {
        next(handleError(error, "permissionMiddleware"));
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