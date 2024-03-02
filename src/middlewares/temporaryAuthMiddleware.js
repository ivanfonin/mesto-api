const temporaryAuthMiddleware = (req, res, next) => {
  req.user = {
    _id: process.env.USER_ID || '',
  };

  next();
};

export default temporaryAuthMiddleware;
