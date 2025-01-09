// Middleware for logging request details
export const logRequestDetails = (req, res, next) => {
    const currentDateTime = new Date().toISOString();
    console.log(`[${currentDateTime}] Incoming request: ${req.method} ${req.originalUrl}`);
    next(); // Continue to the next middleware/route handler
  };
  

  export const logResponseStatus = (req, res, next) => {
    const start = Date.now(); // Capture the request start time
  
    // Hook into the 'finish' event of the response to capture the status code
    res.on('finish', () => {
      const duration = Date.now() - start; // Calculate request duration
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
  
    next(); // Continue to the next middleware/route handler
  };
  