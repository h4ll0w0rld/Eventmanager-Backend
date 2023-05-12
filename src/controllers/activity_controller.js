const db = require("../models");

// create main Model
const Activity = db.activity;

// Add new Activity
const addActivity = async (req, res) => {
    let info = {
        shift_id: req.body.shift_id,
        shift_category_id: req.body.shift_category_id
    }
    const activity = await Activity.create(info)
    res.status(200).send({ message: "successful created new Activity", data: activity })
}

// GET ALL Activities by Shift_Category

const getActivitiesByShiftCategory = async (req, res) => {
    let shift_category_id = req.params.shift_category_id;
    let activities = await Activity.findAll({ where: { shift_category_id: shift_category_id } })
    res.status(200).send(activities)
}


module.exports = {
    addActivity: addActivity,
    getActivitiesByShiftCategory: getActivitiesByShiftCategory
}
