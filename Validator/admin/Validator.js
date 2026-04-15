import { body, check } from "express-validator";
import Licence from "../../Models/admin/Licence.js";
import Super from "../../Models/admin/Superadmin.js";

export const LicenceValidator = [
    body('licence_no').notEmpty().withMessage('Licence Number is required')
        .isNumeric().withMessage('Licence Number must be a Number')
        .custom(async (value, { req }) => {
            const { id } = req.params;
            const licenceno = {
                licence_no: value
            }
            if (id) {
                licenceno._id = { $ne: id }
            }
            const existinglicence = await Licence.exists(licenceno);
            if (existinglicence) {
                throw new Error("Licence Number alrady in use");
            }
        }),
    body("licence_date").notEmpty().withMessage("Licence date is required")
        .isDate().withMessage("Licence must be YYYY-MM-DD"),
    body("amc_due_date").notEmpty().withMessage("Amc Due Date is required")
        .isDate().withMessage("Amc Due Date is must be YYYY-MM-DD"),
    body("company_name").notEmpty().withMessage("Company name is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("owner_name").notEmpty().withMessage("Owner name is required"),
    body("owner_name").notEmpty().withMessage("Owner name is required"),
    body("contact_no").notEmpty().withMessage("Contact number is required")
        .isNumeric().withMessage("Contact number must be a number")
        .isLength({ max: 10, min: 10 }).withMessage("Contact number must contain exactly 10 digits (no more, no less)"),
    body("deal_amt").notEmpty().withMessage("Deal amount is required")
        .isNumeric().withMessage("Deal amount must be a number"),
    body("receive_amt").notEmpty().withMessage("Receive amount is required")
        .isNumeric().withMessage("Receive amount must be a number"),
    body("due_amt").notEmpty().withMessage("Due amount is required")
        .isNumeric().withMessage("Due amount must be a number"),
    body("amc_amt").notEmpty().withMessage("Amc amount is required")
        .isNumeric().withMessage("Amc amount must be a number"),
    body("branch_count").notEmpty().withMessage("Branch count is required")
        .isNumeric().withMessage("Branch count must be a number"),
    body("sales_man").notEmpty().withMessage("Sales man is required"),
    body("is_active").notEmpty().withMessage("Is_active is required")
        .isBoolean().withMessage("IS_active must be true/false"),
];

export const SuperadminValidator = [
    body("username").notEmpty().withMessage("Username is required")
        .custom(async (value, { req }) => {
            const { id } = req.params;

            const superadmin = {
                username: value
            }
            if (id) {
                superadmin._id = { $ne: id }
            }
            const existingsuper = await Super.exists(superadmin);
            if (existingsuper) {
                throw new Error('This username is already taken. Please choose another one.')
            }
        }),
    body("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

export const LoginValidator = [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required")
];