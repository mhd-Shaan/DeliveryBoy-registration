import express from 'express';
import { autoAssignDeliveryBoy, checkAuth, DeliveryBoyreg, finalRegistration, getCurrentOrder, logindeliveryboy, updateLocation, verifyOTP } from '../controllers/authController.js';
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
router.patch('/location/:id', protectRouteuser, updateLocation);
router.get('/current-order/:id', protectRouteuser, getCurrentOrder);
router.post('/auto-assign', autoAssignDeliveryBoy);




export default router;