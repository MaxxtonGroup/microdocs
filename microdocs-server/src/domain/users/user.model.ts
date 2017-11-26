import { IsEmail, NotEmpty } from "validator.ts/decorator/Validation";
import { Validator } from "validator.ts/Validator";
import { ValidationError } from "validator.ts/ValidationError";

/**
 * User model
 * /api/v2/users
 */
export class User {

  @NotEmpty()
  username: string;
  displayName?: string;
  @IsEmail()
  email?: string;

  constructor(userOptions?: UserOptions) {
    if (userOptions) {
      this.edit(userOptions);
    }
  }

  /**
   * Validate model
   */
  validate() {
    new Validator().validateOrThrow(this);
  }

  /**
   * Edit user properties
   * @param {UserOptions} userOptions
   */
  edit(userOptions: UserOptions) {
    this.username = userOptions.username;
    this.displayName = userOptions.displayName;
    this.email = userOptions.email;
    this.validate();
  }
}

export interface UserOptions {

  username: string;
  displayName?: string;
  email?: string;

}