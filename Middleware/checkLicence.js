import mongoose from "mongoose";
import  { connectMasterDb }  from "../config/clientdb.js";

const checkLicence = async (req, res, next) => {
    const licence_no_header = req.headers['licence_no'] || req.headers['licence-no'];

    if (!licence_no_header) {
        return res.status(200).json({ status: false, message: "Licence number is required" });
    }

    try {
        const masterDb = connectMasterDb();

        const Licence = masterDb.model('Licence', new mongoose.Schema({
            licence_no: Number,
            db_name: String,
            amc_due_date: Date,
            is_active: Boolean,
        }), 'licences');

        const licence_no = Number(licence_no_header);
        if (isNaN(licence_no)) {
            return res.status(200).json({ status: false, message: "Invalid licence number format" });
        }
        const licence = await Licence.findOne({ licence_no }).lean();

        if (!licence) {
            return res.status(200).json({ status: false, message: "Invalid licence number" });
        }

        if (!licence.is_active || new Date() > new Date(licence.amc_due_date)) {
            return res.status(200).json({ status: false, message: "Licence expired or inactive" });
        }

        req.dbName = licence.db_name;
        next();
    } catch (err) {
        next(err);
    }
};

export default checkLicence;