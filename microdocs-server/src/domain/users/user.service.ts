import { User, UserOptions } from "./user.model";
import { UserRepository } from "./user.repository";
import { ValidationError } from "validator.ts/ValidationError";

/**
 * Manage Users
 */
export class UserService {

  constructor(private userRepository: UserRepository) {

  }

  /**
   * Create new User
   * @param {UserOptions} userOptions
   */
  public async createUser(userOptions: UserOptions): Promise<User> {
    // Create user
    let user = new User(userOptions);

    // Validate user
    user.validate();
    if (await this.existsUser(userOptions.username)) {
      throw new ValidationError([
        {
          property: "username",
          errorCode: 0,
          errorName: "Not Unique",
          errorMessage: "Username '" + user.username + "' is already used",
          value: user.username,
          required: true,
          objectClass: null
        }]);
    }

    // Save and return user
    return await this.userRepository.save(user);
  }

  /**
   * Edit properties of a User
   * @param {string} username
   * @param {UserOptions} userOptions
   * @returns {User}
   */
  public async editUser(username: string, userOptions: UserOptions): Promise<User | null> {
    // Find user
    let user = await this.userRepository.findById(username);
    if (!user) {
      return null;
    }

    // Edit properties
    user.edit(userOptions);
    if (username.toLowerCase() !== username.toLowerCase()) {
      if (await this.existsUser(userOptions.username)) {
        throw new ValidationError([
          {
            property: "username",
            errorCode: 0,
            errorName: "Not Unique",
            errorMessage: "Username '" + user.username + "' is already used",
            value: user.username,
            required: true,
            objectClass: null
          }]);
      }
    }

    // Save and return user
    return await this.userRepository.save(user);
  }

  /**
   * Get user by username
   * @param {string} username
   * @returns {User}
   */
  public getUser(username: string): Promise<User | null> {
    return this.userRepository.findById(username);
  }

  /**
   * Check if a user already exists
   * @param {string} username
   * @returns {boolean}
   */
  public async existsUser(username: string): Promise<boolean> {
    return await this.getUser(username) !== null;
  }

}