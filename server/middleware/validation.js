export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      const errorDetails = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      
      return res.status(400).json({
        message: "Validation failed",
        errors: errorDetails,
      });
    }
    
    // Replace req.body with parsed/sanitized Zod data
    req.body = result.data;
    next();
  };
};
