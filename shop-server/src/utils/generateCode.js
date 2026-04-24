const generateCode = (prefix = "ORD") => {
  const random = Math.floor(100000 + Math.random() * 900000);
  const time = Date.now().toString().slice(-4);

  return `${prefix}-${time}${random}`;
};

export default generateCode;
