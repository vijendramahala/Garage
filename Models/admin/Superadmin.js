import mongoose from 'mongoose';

const superSchema = new mongoose.Schema({
    licence_id: {type: String, require: false},
    licence_no: { type: String, required: false },
    branch_id: { type: String, required: false },
    username: { type: String, unique: true, required: true },
    sub_name: { type: String, required: false },
    contact_no: { type: String, required: false },
    right_list: { type: String, required: false },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['user', 'subadmin', 'superadmin'],
    },
    }, {
        timestamps: true
});

export default mongoose.model('Super', superSchema);