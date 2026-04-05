const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    // We explicitly wrap the function call in Promise.resolve
    // to ensure 'next' is passed correctly to the error handler.
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};

export default catchAsyncErrors;