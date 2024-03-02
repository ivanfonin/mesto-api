const temporaryAuthMiddleware = (req, res, next) => {
  req.user = {
    _id: '65e32432def0b10ca366efb3',
  };

  next();
};

export default temporaryAuthMiddleware;
