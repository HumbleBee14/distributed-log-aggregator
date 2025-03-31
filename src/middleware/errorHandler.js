function errorHandler(err, req, res, next) {
    console.error('Error occurred:', err);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  export default errorHandler;