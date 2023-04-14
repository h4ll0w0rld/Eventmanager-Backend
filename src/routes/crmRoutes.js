const routes = (app) => {
    app.route('/shift')
        .get((req, res) => {
            res.send('GET request successful');
        })
        .post((req, res) => {
            res.send('POST request successful');
        });

    app.route('/shift/:shiftId')
        .put((req, res) => {
            res.send('PUT request successful');
        })
        .delete((req, res) => {
            res.send('DELETE request successful');
        });

};


export default routes;