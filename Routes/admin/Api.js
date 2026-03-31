import express from "express";
const router = express.Router();


import * as LicenceController from '../../Controllers/admin/LicenceController';

router.get('/licence', LicenceController.store);
router.post('/licence', LicenceController.store);
router.put('/licence/:id', LicenceController.update);
router.delete('/licence/:id', LicenceController.destroy);
router.get('/licence_autono', LicenceController.autono);
router.post('/licencebycontectno', LicenceController.getbycontectno);


export default router;