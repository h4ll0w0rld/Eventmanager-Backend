import { shift } from '..';

const moment = require('moment');

class Shift_Category_class {
    constructor(info, shifts) {
        this.name = info.name;
        this.description = info.description;
        this.event_id = info.event_id;
        this.shifts = shifts;
    }

    // // Genertates the Shifts with Activities as object in the Shifts Array
    // createShifts(shiftCategory) {
    //     let shifts = [];
    //     const startTime = shiftCategory.startTime;
    //     const endTime = shiftCategory.endTime;
    //     const intervall = shiftCategory.intervall;
    //     const days = shiftCategory.days;
    //     const activitiesPerShift = shiftCategory.activitiesPerShift;


    //     const numberOfShiftsPerDay = moment.duration(moment(endTime, 'HH:mm', true).diff(moment(startTime, 'HH:mm', true))).asMinutes() / intervall;


    //     days.forEach(day => {
    //         let shiftStartTime = startTime;
    //         let shiftEndTime = endTime;
    //         for (let i = 0; i < numberOfShiftsPerDay; i++) {
    //             shiftStartTime = moment(startTime, 'HH:mm', true).add(intervall * i, 'minutes').format('HH:mm');
    //             shiftEndTime = moment(shiftStartTime, 'HH:mm', true).add(intervall, 'minutes').format('HH:mm');
    //             let shift = {
    //                 date: day,
    //                 startTime: shiftStartTime,
    //                 endTime: shiftEndTime,
    //                 activities: []
    //             }
    //             for (let i = 0; i < activitiesPerShift; i++) {
    //                 shift.activities.push({})
    //             }
    //             shifts.push(shift);
    //         }
    //     }
    //     )
    //     this.shifts = shifts;

    // }
}



export default Shift_Category_class;