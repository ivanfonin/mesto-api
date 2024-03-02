interface AppError extends Error {
  statusCode?: number;
}

export default AppError;
