import mongoose from 'mongoose';
import Licence from '../../Models/admin/Licence.js';
import { validationResult } from 'express-validator';

export const index = async (req, res) => {
    try{
        const licence = await Licence.find().lean();
        return res.status(200).json({ status: true, data: licence });
    } catch (err) {
        next(err);
        // return res.status(200).json({ status: false, message: err.message })
    }
};

export const store = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const message = errors.array()[0];
            return res.status(200).json({ status: false, message: message.msg })
        }

        const licence = await Licence.create({
            licence_no: req.body.licence_no,
            licence_date: req.body.licence_date,
            amc_due_date: req.body.amc_due_date,
            company_name: req.body.company_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            gst_no: req.body.gst_no,
            owner_name: req.body.owner_name,
            contact_no: req.body.contact_no,
            deal_amt: req.body.deal_amt,
            receive_amt: req.body.receive_amt,
            due_amt: req.body.due_amt,
            amc_amt: req.body.amc_amt,
            branch_count: req.body.branch_count,
            sales_man: req.body.sales_man,
            remark: req.body.remark,
            is_active: req.body.is_active,
            other1: req.body.other1,
            other2: req.body.other2,
            other3: req.body.other3,
            other4: req.body.other4,
            other5: req.body.other5
        });

        const clientDBName = `GRE_${licence.owner_name.toLowerCase().replace(/\s+/g, '_')}_${licence.licence_no}`;
        licence.db_name = clientDBName;
        await licence.save();

        const clientConnection = mongoose.createConnection(`process.env.CLIENT_URL${clientDBName}`);

        return res.status(200).json({ status: true, message: 'Licence create successfully', data: { licence, clientDBName }});
        
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
};

export const update = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const message = errors.array()[0];
            return res.status(200).json({ status: false, message: message.msg });
        }
        const { id } = req.params;
        const licence = await findById(id);
        if(!licence){
            return res.status(200).json({ status: false, message: 'licence not found' });
        }

        const update = {
            licence_no: licence.licence_no,
            licence_date: req.body.licence_date,
            amc_due_date: req.body.amc_due_date,
            company_name: req.body.company_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            gst_no: req.body.gst_no,
            owner_name: req.body.owner_name,
            contact_no: req.body.contact_no,
            deal_amt: req.body.deal_amt,
            receive_amt: req.body.receive_amt,
            due_amt: req.body.due_amt,
            amc_amt: req.body.amc_amt,
            branch_count: req.body.branch_count,
            sales_man: req.body.sales_man,
            remark: req.body.remark,
            is_active: req.body.is_active,
            other1: req.body.other1,
            other2: req.body.other2,
            other3: req.body.other3,
            other4: req.body.other4,
            other5: req.body.other5
        }
        const updatelicence = await Licence.findByIdAndUpdate(id, update, { returnDocument: 'after' });

        return res.status(200).json({ status: true, message: "Licence update successfully", data: updatelicence })
        
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
};

export const destroy = async (req, res) => {
    try{
        const { id } = req.params;

        const licence = await findById(id);
        if(!licence){
            return res.status(200).json({ status: false, message: 'licence not found' });
        }

        if(licence.db_name){
            const tempconn = mongoose.createConnection(`process.env.CLIENT_URL${licence.db_name}`);
            tempconn.once('open', async () => {
                try{
                    await tempconn.dropDatabase();
                    console.log(`Database ${licence.db_name} dropped successfully.`);
                    await tempconn.close();
                } catch (err){
                    console.error("Error dropping DB:", err.message);
                }
            });
        }

        return res.status(200).json({ status: true, message: "Licence&DB delete successfully" });

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
};

export const autono = async (req, res) => {
    try{
    const maxLicence = await Licence.findOne().sort({ licence_no: -1 }).lean();

    let nextNo = 10001;

    if(maxLicence) {
        nextNo = maxLicence.licence_no + 1;
    }

    return res.status(200).json({ status: true, next_licence_no: nextNo })

    } catch (err) {
    console.error('Error fetching next licence no:', err);
        return res.status(200).json({ status: false, message: err.message })
    }
};

export const getbycontectno =  async (req, res) => {
    try{

        const { licence_no, contact_no } = req.body;

        if (!licence_no) {
            return res.status(200).json({
                status: false,
                message: "Licence number is required"
            });
        }

        if (!contact_no) {
            return res.status(200).json({
                status: false,
                message: "Contact number is required"
            });
        }

        const licence = await Licence.findOne({
            licence_no: licence_no,
            contact_no: contact_no
        }).lean();

        if (!licence) {
            return res.status(200).json({
                status: false,
                message: "Invalid licence number or contact number"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            data: licence
        });

    } catch (err) {
    console.error('Error fetching next licence no:', error);
        return res.status(200).json({ status: false, message: err.message })
    }
};