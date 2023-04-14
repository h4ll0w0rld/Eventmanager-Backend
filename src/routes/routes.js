import * as controller from '../controllers/controller';

const routes = (app) => {

    /***** shifts *****/
    app.route('/shift')
        .get(controller.getAllShifts)

        .post(controller.addNewShift);

    app.route('/shift/:idShift')
        .put(controller.editShift)

        .delete(controller.deleteShift);

};


export default routes;