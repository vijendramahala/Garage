import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    licence_no: {type: Number, require: true},
    branch_id: {type: String, require: true},
    customer_id: {type: String, require: false},
    supplier_id: {type: String, require: false},
    employee_id: {type: String, require: false},
    ledger_name: {type: String, require: true},
    contact_no: {type: Number, require: false},
    whatapp_no: {type: Number, require: false},
    email: {type: String, require: false},
    ledger_group: {type: String, require: true},
    opening_balance: {type: Number, required: true, default: 0 },
    opening_type: {type: String, require: true, default: 'DR'},
    closing_balance: {type: Number, require:false, default: 0},
    gst_no: {type: String, require: false},
    address: {type: String, require: false},
    state: {type: String, require: false},
    city: {type: String, require: false},
    town: {type: String, require: false},
    other1: {type: String, require: false},
    other2: {type: String, require: false},
    other3: {type: String, require: false},
    other4: {type: String, require: false},
    other5: {type: String, require: false},
    }, {
        timestamps: true,
});

export default mongoose.model('Ledger', ledgerSchema);