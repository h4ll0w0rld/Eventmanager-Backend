class Shift_Category {
    constructor(shiftCategory, shifts) {
        this.id = shiftCategory.id;
        this.name = shiftCategory.name;
        this.description = shiftCategory.description;
        this.shifts = shifts;
    }

}

export default Shift_Category;