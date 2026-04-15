import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    licence_no: { type: Number, required: false },
    branch_id: { type: String, required: false },
    employee_id: { type: String, required: false },
    username: { type: String, required: false, unique: true },
    sub_name: { type: String, required: false },
    contact_no: { type: String, required: false },
    right_list: { type: String, required: false },
    single_right: [
        {
            module: {type: String, required: false},
            view: {type: Boolean, required: false},
            create: {type: Boolean, required: false},
            update: {type: Boolean, required: false},
            delete: {type: Boolean, required: false},
        }
    ],
    password: { type: String, required: false },
    status: {type: Boolean, required: false},
    role: {
        type: String,
        required: false,
        enum: ['user', 'admin', 'superadmin'],
    },
        }, {
        timestamps: true
});

export default mongoose.model('User', userSchema);