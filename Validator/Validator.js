import { body, check } from 'express-validator';
import loadModel from '../Utils/LoadModels.js';

export const branchValidator = [
    body('licence_no').notEmpty().withMessage("Licence is required")
        .isNumeric().withMessage("Licence is must be a number"),
    body('contact_no').notEmpty().withMessage("Contect number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Contect number must be 10 digits")
        .isNumeric()
        .withMessage("Contect number must contain only numbers")
        .custom(async (value, { req }) => {
            const { Branch } = loadModel(req.dbName);
            const branch = req.params.id;
            const existingcontectno = await Branch.exists({
                contact_no: value,
                ...(branch ? { _id: { $ne: branch } } : {})
            });
            if (existingcontectno) {
                throw new Error('Contect number already in use');
            }
            return true;
        }),
    body('name').notEmpty().withMessage('Name is required'),
    body("branch_name")
        .notEmpty()
        .withMessage("Branch Name is required")
        .custom(async (value, { req }) => {
            const { Branch } = loadModel(req.dbName);

            const branch = req.params.id;

            const existinglicenceno = await Branch.exists({
                branch_name: value,
                ...(branch ? { _id: { $ne: branch } } : {})
            });
            if (existinglicenceno) {
                throw new Error('Branch Name already in use');
            }
            return true;
        }),
        body('address').notEmpty().withMessage('Address is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('is_active').notEmpty().withMessage('status is required')
        .isBoolean().withMessage('Is active is must be true/false'),
        body("username").notEmpty().withMessage("Username is required")
            .custom(async (value, { req }) => {
                const { User } = loadModel(req.dbName);
                const currentbranchid = req.params.id;
                const existinguser = await User.exists({
                    username: value,
                    branch_id: { $ne: currentbranchid }
                });
                if (existinguser) {
                    throw new Error('Username already in use by another employee.');
                }
                return true;
            }),
        body("password").notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

export const loginValidator = [
    body('licence_no').notEmpty().withMessage('Licence Number is required'),
    body('branch_id').notEmpty().withMessage('Branch is required'),
    body('username').notEmpty().withMessage('username is required'),
    body('password').notEmpty().withMessage('password is required')
];