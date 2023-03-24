const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("Id này không hợp lệ hoặc không tìm thấy");
};
module.exports = validateMongoDbId;