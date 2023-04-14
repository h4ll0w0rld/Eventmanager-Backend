
/**** SHIFTS ****/

//GET all shifts
export const getAllShifts = (req, res) => {
    db.query('Select * from Shift;', (err, data) => {
        if (err) throw err;
        res.json(data);
    });
}

//POST a new shift
export const addNewShift = (req, res) => {
    db.query('INSERT INTO Shift (startTime, endTime) VALUES (?,?);', [req.body.startTime, req.body.endTime], (err, data) => {
        if (err) throw err;
        res.json(data);
    });
}


//EDIT excisting shift
export const editShift = (req, res) => {
    db.query('UPDATE Shift SET startTime = ?, endTime = ? WHERE idShift = ? ', [req.body.startTime, req.body.endTime, req.params.idShift], (err, data) => {
        console.log(req.body.startTime, req.body.endTime, req.params.idShift);
        if (err) throw err;
        res.json(data);
    });
}


//DELETE excisting shift
export const deleteShift = (req, res) => {
    db.query('DELETE FROM Shift WHERE idShift = ? ', [req.params.idShift], (err, data) => {
        if (err) throw err;
        res.json(data);
    });
}