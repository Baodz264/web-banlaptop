import UserService from "./user.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class UserController {

  getProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getProfile(req.user.id);
    return response.success(res, user);
  });

  updateProfile = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.avatar = `/uploads/users/${req.file.filename}`;
    }

    const user = await UserService.updateProfile(req.user.id, data);

    return response.success(res, user, "Profile updated");
  });

  /* GET ADMINS */

  getAdmins = asyncHandler(async (req, res) => {

    const admins = await UserService.getAdmins();

    return response.success(res, admins);

  });

  getUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getUsers(req.query);
    return response.success(res, users);
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    return response.success(res, user);
  });

  createUser = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.avatar = `/uploads/users/${req.file.filename}`;
    }

    const user = await UserService.createUser(data);

    return response.success(res, user, "User created");
  });

  updateUser = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.avatar = `/uploads/users/${req.file.filename}`;
    }

    const user = await UserService.updateUser(req.params.id, data);

    return response.success(res, user, "User updated");
  });

  deleteUser = asyncHandler(async (req, res) => {

    await UserService.deleteUser(req.params.id);

    return response.success(res, null, "User deleted");
  });
}

export default new UserController();
