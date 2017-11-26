
import { Validator } from "validator.ts/Validator";
import { IsAlphanumeric, Matches, NotEmpty } from "validator.ts/decorator/Validation";

/**
 * Repository model
 * /api/v2/projects/{projectCode}/repos
 */
export class Repo {

  @NotEmpty()
  @IsAlphanumeric()
  code: string;

  @NotEmpty()
  name: string;

  constructor(repoOptions?: RepoOptions){
    if(repoOptions) {
      this.edit(repoOptions);
    }
  }

  /**
   * Validate model
   */
  public validate() {
    new Validator().validateOrThrow(this);
  }

  /**
   * Edit repository properties
   * @param {RepoOptions} repoOptions
   */
  public edit(repoOptions: RepoOptions){
    this.code = repoOptions.code;
    this.name = repoOptions.name;
    this.validate();
  }

}

export interface RepoOptions {

  code: string;
  name: string;

}

