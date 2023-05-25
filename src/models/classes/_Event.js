class Event_class {
    constructor(event, shiftCategories) {
        this.id = event.id;
        this.name = event.name;
        this.description = event.description;
        this.startDate = event.startDate;
        this.endDate = event.endDate;
        this.location = event.location;
        this.shiftCategories = shiftCategories;
    }
}

export default Event_class;