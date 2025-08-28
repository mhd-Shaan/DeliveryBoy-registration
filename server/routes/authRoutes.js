import express from 'express';
import { DeliveryBoyreg, finalRegistration, verifyOTP } from '../controllers/authController.js';
import {   upload } from '../config/multer.js';



const router = express.Router();
router.post('/registration', DeliveryBoyreg);
router.post('/verify-otp', verifyOTP);
// router.post('/registration2', DeliveryBoyreg);
// router.post("/registration2", upload.single("photo"), DeliveryBoyreg2);
// router.post('/registration3', storeUpload.array('licenseImage', 2), DeliveryBoyreg3);
router.post(
  "/finalregistration",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "licenseImage", maxCount: 2 },
  ]),
  finalRegistration
);




export default router;