import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    licence_no: {type: Number, require: true},
    contect_no: {type: String, require: true},
    name: {type: String, required: true},
    branch_name: {type: String, required: true, unique: true},
    business_type: {type: String, required: false},
    gst_no: {type: String, required: false},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    last_active_date: {type: String, required: false},
    is_active: { type: Boolean, required: true },
    api_key: {type: String},
    other1: {type: String, required: false},
    other2: {type: String, required: false},
    other3: {type: String, required: false},
    other4: {type: String, required: false},
    other5: {type: String, required: false},
    }, {
        timestamps: true
});

export default mongoose.model('Branch', branchSchema);