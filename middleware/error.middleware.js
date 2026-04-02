export const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
      details: err.errors?.map((e) => e.message),
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Database validation error.',
      details: err.errors?.map((e) => e.message),
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};