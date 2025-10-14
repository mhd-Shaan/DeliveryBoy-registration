import jwt from "jsonwebtoken"
import DeliveryRegistration from "../models/deliveryBoySchema.js";

const protectRouteuser = async (req, res, next) => {

  try {
    
    
    const token = req.cookies?.token// Ensure token is read properly
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }

const Userdata = await DeliveryRegistration.findById(decoded.id)
  req.boy = Userdata;

      next();

  } catch (error) {
    console.error("Error from protectRoute:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export { protectRouteuser };