const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      error: "xyz",
      name: "AuthError",
      message: "You must be logged in to perform this action",
    });
  } else {
    console.log("User is set");
    return next();
  }
};

module.exports = { requireUser };
