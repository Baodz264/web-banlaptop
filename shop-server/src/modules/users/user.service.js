import bcrypt from "bcryptjs";
import UserRepository from "./user.repository.js";

class UserService {

  static async getProfile(userId) {

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return user;
  }

  static async updateProfile(userId, data) {

    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return await UserRepository.updateProfile(userId, data);
  }

  static async getAdmins() {
    return await UserRepository.findAdmins();
  }

  static async getUsers(query) {
    return await UserRepository.findAll(query);
  }

  static async getUserById(id) {

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return user;
  }

  static async createUser(data) {

    const exist = await UserRepository.findByEmail(data.email);

    if (exist) {
      throw new Error("Email đã tồn tại");
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return await UserRepository.create(data);
  }

  static async updateUser(id, data) {

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return await UserRepository.update(id, data);
  }

  static async deleteUser(id) {

    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return await UserRepository.softDelete(id);
  }
}

export default UserService;
