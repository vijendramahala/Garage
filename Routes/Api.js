import express from "express";
const router = express.Router();

import { verifyToken } from "../Middleware/Auth.js";
import checkLicence from "../Middleware/checkLicence.js";

import * as BranchController from "../Controllers/BranchController.js";

import { branchValidator, loginValidator } from "../Validator/Validator.js";

router.post('/login', checkLicence, loginValidator, BranchController.login);

//Branch
router.get('/branch', checkLicence , verifyToken, BranchController.index);
router.get('/:licence_no', checkLicence , verifyToken, BranchController.getbranchbylicence);
router.get('get/branch/:id', checkLicence , verifyToken, BranchController.getbranchByid);
router.post('/branch', checkLicence, verifyToken, branchValidator, BranchController.store);
router.put('/branch/:id', checkLicence, verifyToken, branchValidator, BranchController.update);
router.delete('/branch/:id', checkLicence, verifyToken, BranchController.destroy);

export default router;