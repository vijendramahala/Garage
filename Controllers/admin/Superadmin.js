import { validationResult } from "express-validator";
import Super from "../../Models/admin/Superadmin.js";
import jwt from "jsonwebtoken";

export const index = async (req, res, next) => {
    try {
        const superadmin = await Super.find().lean();
        return res.status(200).json({ status: true, data: superadmin });

    } catch (err) {
        next(err);
    }
};

export const store = async (req, res, next) => {
    try {
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }
        const superadmin = await Super.create({
            username: req.body.username,
            password: req.body.password,
            role: 'superadmin'
        });
        return res.status(200).json({ status: true, message: "Supperadmin created successfully", data:  superadmin});

    } catch (err) { 
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const validator = validationResult(req);
        if (!validator.isEmpty()) {
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }
        const { id } = req.params;
        const superadmin = await Super.findById(id);
        if (!superadmin) {
            return res.status(200).json({ status: 200, message: "Superadmin not found" });
        }

        const update = {
            username: req.body.username,
            password: req.body.password,
        }
        const updatesuperadmin = await Super.findByIdAndUpdate(id, update, { returnDocument: 'after' });
        return res.status(200).json({ status: true, message: "Superadmin updated successfully", data: updatesuperadmin })

    } catch (err) {
        next(err);
    }
    };

export const destroy = async (req, res, next) => {
    try{
        const { id } = req.params;

        const superadmin = await Super.findById(id);
        if(!superadmin){
            return res.status(200).json({ status: false, message: "Superadmin not found" });
        }
        await Super.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Superadmin deleted successfully" });
    } catch (err){
        next(err);
    }
};

export const login = async (req, res, next) => {
    try{
        const validator = validationResult(req);
        if(!validator.isEmpty()){
            const message = validator.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }
        const { username, password } = req.body;
        const superadmin = await Super.findOne({ username });
        if(!superadmin || superadmin.role !== "superadmin" ){
            return res.status(200).json({ status: false, message: "Only superadmin, is allowed to authorized" });
        }
        if(superadmin.password !== password) {
            return res.status(200).json({ status: false, message: "Invalid password" });
        }
        const token = jwt.sign(
            { userId: superadmin._id, role: superadmin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );
        return res.status(200).json({ 
            status: true,
            message: "Login successfully",
            token
        });
    } catch (err){
        next(err);
    }
};