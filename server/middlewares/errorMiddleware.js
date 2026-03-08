// backend me jo bhi errors aaye unko properly handle karke client ko clean response bhejna.
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";


  if(err.code==11000){
    err.message = "Duplicate Key Error: A record with this value already exists.";
    err.statusCode = 400;
    err= new ErrorHandler(err.message, err.statusCode);
  }

  if(err.name === "TokenExpiredError"){
    const messages = Object.values(err.errors).map((val) => val.message);
    err.message = `Validation Error: ${messages.join(", ")}`;
    err.statusCode = 400;
    err= new ErrorHandler(err.message, err.statusCode);
  }   

  if(err.name=="JsonWebTokenError"){
    const statusCode = 400;
    const message = "Invalid Token: Please provide a valid token.";
    err = new ErrorHandler(message, statusCode);
  }

  if(err.name=="CastError"){
    const statusCode = 400;
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, statusCode);
    
  }

  const errorMessage=err.errors? Object.values(err.errors).map((val) => val.message).join(", "): err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;