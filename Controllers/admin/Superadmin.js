import Super from "../../Models/admin/Superadmin.js";

export const index = async (req, res) => {
    try{
        const superadmin = await Super.find().lean();
        return res.status(200).json({ status: true, data: superadmin });

    } catch (err){
        next(err);
    }
};

export const store = async (req, res) => {
    try{
        

    } catch (err){
        next(err);
    }
};