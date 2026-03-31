import mongoose from 'mongoose';

const licenceSchema = new mongoose.Schema({
    licence_no: {type: Number, unique: true, required: true},
    licence_date: {type: Date, required: true},
    amc_due_date: {type: Date, required: true},
    company_name: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    gst_no: {type: String, required: false},
    owner_name: {type: String, required: true},
    contact_no: {type: Number, required: true},
    deal_amt: { type: Number, required: true},
    receive_amt: {type: Number, required: true},
    due_amt: {type: Number, required: true},
    amc_amt: {type: Number, required: true},
    branch_count: {type: Number, required: true},
    sales_man: {type: String, required: true},
    remark: { type: String, required: false, maxlength: 1000 },
    is_active: { type: Boolean, required: true },
    db_name: { type: String },
    other1: {type: String, required: false},
    other2: {type: String, required: false},
    other3: {type: String, required: false},
    other4: {type: String, required: false},
    other5: {type: String, required: false}
    }, {
        timestamps: true
});

export default mongoose.model('Licence', licenceSchema);