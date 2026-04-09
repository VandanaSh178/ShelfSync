export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  res.status(statusCode).cookie("token", token,{
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: "Lax",
    secure:false,
  } ).json({
    success: true,
    message,
    user,
    token,
  });
};
