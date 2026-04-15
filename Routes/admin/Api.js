import express from "express";
const router = express.Router();

import { verifyToken } from "../../Middleware/Auth.js";


import * as LicenceController from "../../Controllers/admin/LicenceController.js";
import * as SuperadminController from "../../Controllers/admin/Superadmin.js";


import { LicenceValidator } from "../../Validator/admin/Validator.js";
import { SuperadminValidator } from "../../Validator/admin/Validator.js";
import { LoginValidator } from "../../Validator/admin/Validator.js";

//Licence
router.get('/licence', verifyToken, LicenceController.index);
router.post('/licence', verifyToken, LicenceValidator, LicenceController.store);
router.put('/licence/:id', verifyToken, LicenceValidator, LicenceController.update);
router.delete('/licence/:id', verifyToken, LicenceController.destroy);
router.get('/licence_autono', verifyToken, LicenceController.autono);
router.post('/licencebycontectno', verifyToken, LicenceController.getbycontectno);

//superadmin
router.get('/superadmin', verifyToken, SuperadminController.index);
router.post('/superadmin', SuperadminValidator, SuperadminController.store);
router.put('/superadmin/:id', verifyToken, SuperadminValidator, SuperadminController.update);
router.delete('/superadmin/:id', verifyToken, SuperadminController.destroy);
router.post('/superadmin/login', LoginValidator, SuperadminController.login);


export default router;