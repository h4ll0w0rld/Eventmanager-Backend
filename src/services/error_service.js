const handleErrors = (error, name) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    if (error.destination) {
        error.destination += " -> " + name;
    } else {
        error.destination = name;
    }
    return error;
}


module.exports = {
    handleErrors
}