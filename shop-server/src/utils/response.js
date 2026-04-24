const success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data = null, message = "Created") => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message = "Error", status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

export default {
  success,
  created,
  error,
};
