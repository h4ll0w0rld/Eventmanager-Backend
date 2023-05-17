class Shift_Category_class {
    constructor(shiftCategory, shifts) {
        this.id = shiftCategory.id;
        this.name = shiftCategory.name;
        this.description = shiftCategory.description;
        this.event_id = shiftCategory.event_id;
        this.shifts = shifts;
    }

}

export default Shift_Category_class;