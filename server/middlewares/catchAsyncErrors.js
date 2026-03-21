const catchAsyncErrors = (theFunc) => {
  return function (req, res, next) {
    Promise.resolve(theFunc(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsyncErrors;