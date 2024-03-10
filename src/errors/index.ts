interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export default AppError;
