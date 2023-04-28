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

    /***** User *****/

    app.route('/user')
        .post(controller.addNewUser);

    app.route('/user/:id')
        .get(controller.getUserById)
        .put(controller.editUser)
        .delete(controller.deleteUser);


    /***** Shifts *****/
    app.route('/shift')
        .get(controller.getAllShifts)
        .post(controller.addNewShift);

    app.route('/shift/:id')
        .get(controller.getShiftById)
        .put(controller.editShift)
        .delete(controller.deleteShift);


    /***** ShiftCategory *****/
    app.route('/shiftCategory')
        .get(controller.getAllShiftCategories)
        .post(controller.addNewShiftCategory);

    app.route('/shiftCategory/:id')
        .get(controller.getShiftCategoryById)
        .put(controller.editShiftCategory)
        .delete(controller.deleteShiftCategory);

};


export default routes;