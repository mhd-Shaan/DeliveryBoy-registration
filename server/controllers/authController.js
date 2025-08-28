import express from "express";
import DeliveryBoy from "../models/deliveryBoySchema.js";
import OtpVerification from "../models/otpSchema.js";
import { sendOTP } from "../helpers/emailService.js";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import tempboySchema from "../models/tempboySchema.js";


const router = express.Router();
export const DeliveryBoyreg = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const tempexist= await tempboySchema.findOne({email})
if(tempexist){
  await tempboySchema.deleteOne({email})
}
    const exists = await DeliveryBoy.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or phone already registered" });
    }

    const existsemail = await DeliveryBoy.findOne({email, emailVerified: false });
    if (existsemail) {
      await DeliveryBoy.deleteOne({ email });
    }

    const exisitingotp = await OtpVerification.findOne({ email });
    if (exisitingotp) {
      await OtpVerification.deleteOne({ email });
    }

    await sendOTP(email, "deliveryboy");

   

    res.status(201).json({
      message: "Registration successful. Awaiting verification.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    console.log(err);
    
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { name,otp,email,phone } = req.body;
     

    if (!name) return res.status(400).json({ error: "name is required" });
    if (!email) return res.status(400).json({ error: "email is required" });
    if (!phone)
      return res.status(400).json({ error: "phone number is required" });
    if (!otp) return res.status(400).json({ error: "otp is required" });

    const otpRecord = await OtpVerification.findOne({
      email,
      userType: "deliveryboy",
    });

    // const existingemail = await DeliveryBoy.findOne({ email });
    // if (existingemail)
    //   return res.status(400).json({ error: "User is already taken" });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

const newBoy = new tempboySchema({ fullName: name, email, phone,verified:true });
    await newBoy.save();
    await OtpVerification.deleteOne({ email });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newBoy });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

export const finalRegistration = async (req, res) => {
  try {
    const {
      email,
      password,
      district,
      pincode,
      address,
      dob,
      gender,
      licenseNumber,
    } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // find tempboy (must be verified already)
    const tempBoy = await tempboySchema.findOne({ email, verified: true });
    if (!tempBoy)
      return res.status(400).json({ message: "OTP not verified or expired" });

    // password hash
    const hashedPassword = await hashPassword(password);

    // photo
    const photo = req.files["photo"] ? req.files["photo"][0].path : null;

    // license images
    const licenseImages = req.files["licenseImage"]
      ? req.files["licenseImage"].map((f) => f.path)
      : [];

    if (!photo) return res.status(400).json({ message: "Photo is required" });
    if (!licenseImages.length)
      return res.status(400).json({ message: "License images required" });

    // create deliveryboy record
    const newBoy = new DeliveryBoy({
      fullName: tempBoy.fullName,
      email: tempBoy.email,
      phone: tempBoy.phone,
      password: hashedPassword,
      district,
      pincode,
      address,
      photo,
      dob,
      gender,
      licenseNumber,
      licenseImage: licenseImages,
      emailVerified: true,
    });

    await newBoy.save();

    // delete tempboy record
    await tempBoy.deleteOne({ email });

    res.status(201).json({
      success: true,
      message: "Final registration completed successfully",
      user: newBoy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// export const DeliveryBoyreg2 = async (req, res) => {
//   try {
//     const { email, password, district, pincode, address } = req.body;
//     const photo=req.file.path
    
//     // console.log(req);
    


//     if (!email) {
//       return res.status(400).json({ message: "email are required" });
//     }

//     if (!password) {
//       return res.status(400).json({ message: "password are required" });
//     }
//     if (!district) {
//       return res.status(400).json({ message: "district are required" });
//     }
//     if (!pincode) {
//       return res.status(400).json({ message: "pincode are required" });
//     }
//     if (!photo) {
//       return res.status(400).json({ message: "photo are required" });
//     }

//     if (!address) {
//       return res.status(400).json({ message: "address are required" });
//     }
//         const hashedPassword = await hashPassword(password);


//     await DeliveryBoy.findOneAndUpdate(
//       { email },
//       {
//         password: hashedPassword,
//         district,
//         pincode,
//         photo,
//         address,
//       },  { new: true }

//     );


//     res.status(201).json({
//       message: "Registration 2 successful",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// export const DeliveryBoyreg3 = async (req, res) => {
//   try {
//     const {email, dob, gender, licenseNumber } = req.body;

//      if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//         const imageUrls = req.files.map((file) => file.path);


//     if (!email) {
//       return res.status(400).json({ message: "email are required" });
//     }
//     if (!dob) {
//       return res.status(400).json({ message: "dob are required" });
//     }

//     if (!gender) {
//       return res.status(400).json({ message: "gender are required" });
//     }
//     if (!licenseNumber) {
//       return res.status(400).json({ message: "licenseNumber are required" });
//     }
    


//     await DeliveryBoy.findOneAndUpdate(
//       { email },
//       {
//         dob,
//         gender,
//         licenseNumber,
//         licenseImage:imageUrls,
//       },  { new: true }

//     );

//     res.status(201).json({
//       message: "Registration 3 successful",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//     console.log(err);
    
//   }
// };





export const logindeliveryboy = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: "email is required" });

    const user = await DeliveryBoy.findOne({ email });
    if (!user) return res.status(400).json({ error: "User is not exisiting" });

    if (!password)
      return res.status(400).json({ error: "password is required" });
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters long" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) res.status(400).json({ error: "Enter correct password" });


    jwt.sign({ id: user.id }, process.env.jwt_SECRET, {}, (err, token) => {
      if (err) throw err;

      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: true, // Ensures cookies are sent only over HTTPS (set to false in development)
        sameSite: "Strict", // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour expiry
      });
res.status(200).json({
  success: true,
  message: "Login successful",
  userdetails: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
  token,
});

    });
  } catch (error) {
    console.log(error);
  }
};

export default router;
