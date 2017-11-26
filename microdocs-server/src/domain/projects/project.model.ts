
import { Validator } from "validator.ts/Validator";
import { IsAlphanumeric, Matches, NotEmpty } from "validator.ts/decorator/Validation";

/**
 * Project model
 * /api/v2/projects
 */
export class Project {

  @NotEmpty()
  @IsAlphanumeric()
  code: string;
  @NotEmpty()
  name: string;

  constructor(projectOptions?: ProjectOptions){
    if(projectOptions) {
      this.edit(projectOptions);
    }
  }

  /**
   * Validate model
   */
  public validate() {
    new Validator().validateOrThrow(this);
  }

  /**
   * Edit user properties
   * @param {UserOptions} userOptions
   */
  public edit(projectOptions: ProjectOptions){
    this.code = projectOptions.code;
    this.name = projectOptions.name;
    this.validate();
  }

}

export interface ProjectOptions {

  code: string;
  name: string;

}

