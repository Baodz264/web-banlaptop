import User from "../../database/mysql/user/user.model.js";

const findByEmail = async (email) => {
  return await User.findOne({
    where: {
      email,
      deleted_at: null,
      status: 1,
    },
  });
};

const findById = async (id) => {
  return await User.findOne({
    where: {
      id,
      deleted_at: null,
      status: 1,
    },
  });
};

const createUser = async (data) => {
  return await User.create(data);
};

const updatePassword = async (id, password) => {
  return await User.update(
    { password },
    { where: { id } }
  );
};

const saveRefreshToken = async (userId, refreshToken) => {
  return await User.update(
    { refresh_token: refreshToken },
    { where: { id: userId } }
  );
};

const revokeRefreshToken = async (userId) => {
  return await User.update(
    { refresh_token: null },
    { where: { id: userId } }
  );
};

export default {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  saveRefreshToken,
  revokeRefreshToken,
};
