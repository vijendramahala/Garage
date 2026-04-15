import loadModel from "../Utils/LoadModels.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Licence from "../Models/admin/Licence.js";
import Ledger from "../Models/Ledger.js";

export const index = async (req, res, next) => {
    try {
        const { Branch, User } = loadModel(req.dbName);

        const branch = await Branch.find().lean();

        if (!branch.length) {
            return res.status(200).json({ status: false, message: "Recode not found" });
        }

        const result = await Promise.all(
            branch.map(async (bra) => {
                const user = await User.findOne({
                    branch_id: bra._id
                });
                return {
                    bra, user
                };
            })
        );
        return res.status(200).json({ status: true, data: result });

    } catch (err) {
        next(err);
    }
};

export const getbranchbylicence = async (req, res, next) => {
    try {
        const { licence_no } = req.params;
        const { Branch, User } = loadModel(req.dbName);
        if (!licence_no) {
            return res.status(200).json({ status: false, message: "Licence number is required" });
        }
        licence_no = NUmber(licence_no);
        if (isNaN(licence_no)) {
            return res.status(200).json({ status: false, message: "Licence number is must br a number" });
        }
        const branch = await Branch.find({ licence_no }).lean();
        if (!branch.length) {
            return res.status(200).json({ status: false, message: "Not branch found for this licence number." });
        }
        const result = await Promise.all(
            branch.map(async (bra) => {
                const user = await User.find({ branch_id: bra._id }).lean();
                return { bra, user }
            })
        );

        return res.status(200).json({ status: true, data: result });

    } catch (err) {
        next(err);
    }
};

export const store = async (req, res, next) => {
    const { Branch, User, Ledger } = loadModel(req.dbName);
    const session = await Branch.db.startSession();
    try {
        session.startTransaction();
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            await session.abortTransaction();
            session.endSession();
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }

        const [branch] = await Branch.create([{
            licence_no: req.body.licence_no,
            contact_no: req.body.contact_no,
            name: req.body.name,
            branch_name: req.body.branch_name,
            business_type: req.body.business_type,
            gst_no: req.body.gst_no,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            last_active_date: req.body.last_active_date,
            is_active: req.body.is_active,
            api_key: req.body.api_key,
            other1: req.body.other1,
            other2: req.body.other2,
            other3: req.body.other3,
            other4: req.body.other4,
            other5: req.body.other5,
        }], { session });
        const user = await User.create([{
            licence_no: branch.licence_no,
            branch_id: branch._id,
            contact_no: branch.contact_no,
            username: req.body.username,
            password: req.body.password,
            role: "admin"
        }], { session });
        const ledger = await Ledger.create([{
            licence_no: branch.licence_no,
            branch_id: branch._id,
            ledger_name: "Direct Sale",
            ledger_group: "Sundry Debtor"
        }], { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            status: true, message: "Branch create successfully.",
            data: { branch, user: user[0], ledger: ledger[0] }
        });
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    const { Branch, User } = loadModel(req.dbName);
    const session = await Branch.db.startSession();
    try {
        session.startTransaction();
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            await session.abortTransaction();
            session.endSession();
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }
        const { id } = req.params;

        const branch = await Branch.findById(id).session(session);
        if (!branch) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({ status: false, message: "Branch not found" })
        }

        const update = {
            licence_no: req.body.licence_no,
            contact_no: req.body.contact_no,
            name: req.body.name,
            branch_name: req.body.branch_name,
            business_type: req.body.business_type,
            gst_no: req.body.gst_no,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            last_active_date: req.body.last_active_date,
            is_active: req.body.is_active,
            api_key: req.body.api_key,
            other1: req.body.other1,
            other2: req.body.other2,
            other3: req.body.other3,
            other4: req.body.other4,
            other5: req.body.other5,
        }
        const updatebranch = await Branch.findByIdAndUpdate(id, update, { returnDocument: 'after', session });
        const userupdate = {
            licence_no: updatebranch.licence_no,
            branch_id: updatebranch._id,
            contact_no: updatebranch.contact_no,
            username: req.body.username,
            password: req.body.password,
        }
        const updateuser = await User.findOneAndUpdate({ branch_id: id }, userupdate, { returnDocument: 'after', session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ status: true, message: 'Branch updated successfully.', data: { branch: updatebranch, user: updateuser } });
    } catch (err) {
        next(err);
    }
};

export const destroy = async (req, res, next) => {
    const { Branch, User } = loadModel(req.dbName);
    const session = Branch.db.startSession();
    try {
        session.startTransaction();
        const { id } = req.params;

        const branch = await Branch.findById(id).session(session);
        if (!branch) {
            await session.abortTransaction();
            return res.status(200).json({ status: false, message: "Branch not found" })
        }

        await User.deleteMany({ branch_id: branch._id }, session);
        await Branch.findByIdAndDelete(id, { session });

        await session.commitTransaction();

    } catch (err) {
        next(err);
    } finally {
        session.endSession();
    }
};

export const getbranchByid = async (req, res, next) => {
    try {
        const { Branch, User } = loadModel(req.dbName);
        const { id } = req.params;

        const branch = await Branch.findOne(id);
        if (!branch) {
            return res.status(200).json({ status: false, message: "Branch not found" });
        }
        const user = await User.findOne({ branch_id: branch._id });

        return res.status(200).json({ status: true, message: "Branch found successfully", data: { branch, user } });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { User, Branch } = loadModel(req.dbName);
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }

        const { username, password, licence_no, branch_id } = req.body;

        const licence = await Licence.findOne({ licence_no });
        if (!licence) {
            return res.status(200).json({ status: false, message: "This Licence is Invalid" });
        }
        const branch = await Branch.findOne({ _id: branch_id });
        if (!branch) {
            return res.status(200).json({ status: false, message: "Branch not found in this licence" });
        }
        const user = await User.findOne({ username, branch_id: branch._id });
        if (!user) {
            return res.status(200).json({ status: false, message: "Invalid username or password" });
        }
        if (user.password !== password) {
            return res.status(200).json({ status: false, message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, licence_no: user.licence_no, branch_id: user.branch_id, },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        return res.status(200).json({
            status: true, message: "Login successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                branch_id: user.branch_id,
                right_list: user.right_list,
                single_right: user.single_right,
                branch_name: branch.branch_name,
                address: branch.address,
                state: branch.state,
                is_active: branch.is_active,
                licence_no: licence.licence_no,
                amc_due_date: licence.amc_due_date,
            }
        });

    } catch (err) {
        next(err);
    }
};