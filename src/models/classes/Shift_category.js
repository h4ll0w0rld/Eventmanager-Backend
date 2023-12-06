import { shift } from '..';

const moment = require('moment');

class Shift_Category_class {
    constructor(info, shifts) {
        this.name = info.name;
        this.description = info.description;
        this.event_id = info.event_id;
        this.shifts = shifts;
    }
}



module.exports = Shift_Category_class;