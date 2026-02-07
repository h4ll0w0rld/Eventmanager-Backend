const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;

const moment = require('moment');


// create main Model
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;
const Event = db.event;
const ShiftCategory = db.shift_category;

// GET ALL Shifts from ShiftCategory
const getAllShifts = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftCategoryInEvent(shift_category_id, event_id);
        let shifts = await Shift.findAll(
            {
                order: [['startTime', 'ASC']],
                where: { shift_category_id: shift_category_id }
            })
        res.status(200).send(shifts)
    } catch (error) {
        next(handleError(error, "shiftController"));
    }
}

// Get Shift by ID

const getShiftById = async (req, res, next) => {
    let shift_id = req.params.shift_id;
    try {
        await validationService.isShiftIDValid(shift_id);
        let shift = await Shift.findOne(
            {
                include: [
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: User,
                                as: "user",
                                attributes: { exclude: ["password"] }
                            }
                        ]
                    },
                ],
                where: { id: shift_id },
                order: [
                    [{ model: Activity, as: "activities" }, "id", "DESC"]
                ]
            });
        console.log(shift, "FOUND SHIFT");
        res.status(200).send(shift);
    } catch (error) {
        next(handleError(error, "shiftController"));
    }
}



//DELETE Shift by ID

const deleteShiftById = async (req, res, next) => {
    let shift_id = req.params.shift_id;
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftInEvent(shift_id, shift_category_id, event_id);
        await Shift.destroy({ where: { id: shift_id } });
        res.status(200).send({ message: "Shift was deleted successfully!" });
    } catch (error) {
        next(handleError(error, "shiftController"));
    }
}




// GET all Shifts by User

const getShiftsByUserAndEvent = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    let status = req.params.status;
    try {
        await validationService.isUserinEvent(user_id, event_id)
        if (status === "all") {
            let shifts = await Shift.findAll(
                {
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: ['id', 'firstName', 'lastName']
                                }
                            ]
                        },

                        {
                            model: ShiftCategory,
                            as: "shift_category"
                        }
                    ],
                    where: {
                        '$shift_category.event_id$': event_id,
                        '$activities.user_id$': user_id
                    },
                    order: [
                        ['activities', 'status', 'DESC'],
                        ['startTime', 'ASC']
                    ],
                });
            res.status(200).send(shifts);
        } else if (status === "requested" || status === "confirmed") {
            let shifts = await Shift.findAll(
                {
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: ['id', 'firstName', 'lastName']
                                }
                            ]
                        },

                        {
                            model: ShiftCategory,
                            as: "shift_category"
                        }
                    ],
                    where: {
                        '$shift_category.event_id$': event_id,
                        '$activities.user_id$': user_id,
                        '$activities.status$': status
                    },
                    order: [
                        ['startTime', 'ASC']
                    ]
                });
            console.log("Shifts of: ", user_id, "Found", shifts)
            res.status(200).send(shifts);
        } else {
            console.log("PROBLEMO")
            throw Object.assign(new Error('Status must be requested, confirmed or all!'), { statusCode: 400 });
        }
    } catch (error) {
        console.log(error);
        next(handleError(error, "shiftController"));
    }
}

const getSelfReqShifts = async (req, res, next) => {
  const event_id = req.params.current_event_id;

  try {
    const shifts = await Shift.findAll({
      include: [
        {
          model: Activity,
          as: "activities",
          required: true, // important: makes it an INNER JOIN so filtering actually works
          where: { status: "selfReq" },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
        {
          model: ShiftCategory,
          as: "shift_category",
          required: true,
        },
      ],
      where: {
        "$shift_category.event_id$": event_id,
      },
      order: [
        ["startTime", "ASC"],
      ],
    });

    return res.status(200).send(shifts);
  } catch (error) {
    next(handleError(error, "shiftController"));
  }
};








//TODO Validate

const getShiftArray = (shiftBlocks) => {
    let shiftArray = [];
    if(shiftBlocks.length > 30){
        throw Object.assign(new Error('Too many shift blocks provided. Maximum allowed is 30.'), { statusCode: 400 });
    }
    try {
        shiftBlocks.forEach(block => {
            block.shiftTypes.forEach(type => {
                const {
                    interval,
                    numberOfShifts,
                    activitiesPerShift,
                    isLeader = false,
                    startTimeOverride
                } = type;

                const baseStartTime = startTimeOverride || block.startTime;

                for (let i = 0; i < numberOfShifts; i++) {
                    const start = moment(baseStartTime)
                        .add(interval * i, 'minutes');

                    const end = moment(start).add(interval, 'minutes');

                    shiftArray.push({
                        startTime: start.format('YYYY-MM-DD HH:mm'),
                        endTime: end.format('YYYY-MM-DD HH:mm'),
                        isLeader,
                        activities: Array.from(
                            { length: activitiesPerShift },
                            () => ({})
                        )
                    });
                }
            });
        });

        // 🔥 LEADER OVERLAP VALIDATION
        validateLeaderOverlaps(shiftArray);

        return shiftArray;

    } catch (error) {
        throw handleError(error, "shiftController");
    }
};

const validateLeaderOverlaps = (shifts) => {
    const leaderShifts = shifts
        .filter(s => s.isLeader)
        .sort((a, b) =>
            moment(a.startTime).diff(moment(b.startTime))
        );

    for (let i = 1; i < leaderShifts.length; i++) {
        const prev = leaderShifts[i - 1];
        const curr = leaderShifts[i];

        if (
            moment(curr.startTime).isBefore(moment(prev.endTime))
        ) {
            throw Object.assign(
                new Error(
                    `Leader shifts overlap:
                     ${prev.startTime} - ${prev.endTime}
                     overlaps with
                     ${curr.startTime} - ${curr.endTime}`
                ),
                { statusCode: 400 }
            );
        }
    }
};

const hasOverlap = (a, b) => {
    return moment(a.startTime).isBefore(moment(b.endTime)) &&
           moment(b.startTime).isBefore(moment(a.endTime));
};

module.exports = {
    getAllShifts: getAllShifts,
    getShiftById: getShiftById,
    deleteShiftById: deleteShiftById,
    getShiftsByUserAndEvent: getShiftsByUserAndEvent,
    getShiftArray: getShiftArray,
    getSelfReqShifts: getSelfReqShifts
}