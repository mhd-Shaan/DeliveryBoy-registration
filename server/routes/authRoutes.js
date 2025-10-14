import express from 'express';
import { checkAuth, DeliveryBoyreg, finalRegistration, logindeliveryboy, verifyOTP } from '../controllers/authController.js';
import {   upload } from '../config/multer.js';
import { protectRouteuser } from '../middleware/authmiddleware.js';



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



router.post('/login',logindeliveryboy)
router.get('/logindetails',protectRouteuser,checkAuth)

export default router;