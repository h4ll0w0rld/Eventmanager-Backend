import * as controller from '../controllers/controller';

const routes = (app) => {

    /***** Events *****/

    app.route('/event')
        .get(controller.getAllEvents)
        .post(controller.addNewEvent);

    app.route('/event/:id')
        .get(controller.getEventById)
        .put(controller.editEvent)
        .delete(controller.deleteEvent);


    /***** Shifts *****/
    app.route('/shift')
        .get(controller.getAllShifts)
        .post(controller.addNewShift);

    app.route('/shift/:id')
        .get(controller.getShiftById)
        .put(controller.editShift)
        .delete(controller.deleteShift);

};


export default routes;