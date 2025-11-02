// backend/src/middleware/errorHandler.js

// Use default export for the single middleware function
const errorHandler = (err, req, res, next) => {
  console.error('ERROR STACK:', err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
};

export default errorHandler; // Changed to default export