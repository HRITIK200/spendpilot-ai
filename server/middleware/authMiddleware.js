import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "spendpilot_jwt_production_secret_2026_xyz";

/**
 * Required authentication middleware.
 * Halts request with 401 if token is missing or invalid.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token missing or invalid format. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

/**
 * Optional authentication middleware.
 * Attaches req.user if a valid Bearer token is provided,
 * but allows unauthenticated guest requests to proceed seamlessly.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
    } catch (error) {
      // Token is invalid/expired, continue as guest
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
