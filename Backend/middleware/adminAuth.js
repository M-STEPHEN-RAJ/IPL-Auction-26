import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

export default adminAuth;