import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;

  // ✅ Step 1: Check for "Bearer" header and extract token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // ✅ Step 2: If no token found
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // ✅ Step 3: Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded user:", req.user);

    // ✅ Step 4: Move on to the next route/middleware
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
