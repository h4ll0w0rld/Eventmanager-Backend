const db = require("../models");

// create main Model
const ShiftCategory = db.shift_category;
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;


// ADD NEW Shift_Category

const addShiftCategory = async (req, res) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        event_id: req.body.event_id
    }
    try {
        const shiftCategory = await ShiftCategory.create(info)
        res.status(200).send({ message: "successful created new Category", data: shiftCategory })
    } catch (error) {
        res.status(500).send({ message: "Error creating new Category", error: error })
    }
}



// GET ALL Shift_Categories by Event

const getAllShiftCategories = async (req, res) => {
    let event_id = req.params.event_id;
    let shiftCategories = await ShiftCategory.findAll({ where: { event_id: event_id } })
    res.status(200).send(shiftCategories)
}


// GET Shift_Category content by ID
const getShiftCategoryById = async (req, res) => {
    let id = req.params.id;
    let shiftCategory = await ShiftCategory.findOne(
        {
            include: [{
                model: Activity,
                as: "activities",
                include: [{
                    model: User,
                    as: "user"
                }],
                include: [{
                    model: Shift,
                    as: "shift"
                }]
            }],
            where: { id: id }
        })
    res.status(200).send(shiftCategory)
}




module.exports = {
    addShiftCategory: addShiftCategory,
    getAllShiftCategories: getAllShiftCategories,
    getShiftCategoryById: getShiftCategoryById
}