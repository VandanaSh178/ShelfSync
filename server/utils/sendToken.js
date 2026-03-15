export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  res.status(statusCode).cookie("token", sendToken,{
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  } ).json({
    success: true,
    message,
    user,
    token,
  });
};
