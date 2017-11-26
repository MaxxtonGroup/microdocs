
import { ValidationError } from "validator.ts/ValidationError";
import { Repo, RepoOptions } from "./repo.model";
import { RepoRepository } from "./repo.repository";

/**
 * Manage Repositories
 */
export class RepoService {

  constructor(private repoRepository: RepoRepository) {

  }

  /**
   * Create new Repository
   * @param {RepoOptions} repoOptions
   */
  public async createRepo(repoOptions: RepoOptions): Promise<Repo> {
    // Create repo
    let repo = new Repo(repoOptions);

    // Validate repo
    repo.validate();
    if (await this.existsRepo(repoOptions.code)) {
      throw new ValidationError([
        {
          property: "code",
          errorCode: 0,
          errorName: "Not Unique",
          errorMessage: "Repository code '" + repo.code + "' is already used",
          value: repo.code,
          required: true,
          objectClass: null
        }]);
    }

    // Save and return repo
    return await this.repoRepository.save(repo);
  }

  /**
   * Edit properties of a Repository
   * @param {string} repoCode
   * @param {RepoOptions} repoOptions
   * @returns {Repo}
   */
  public async editRepo(repoCode: string, repoOptions: RepoOptions): Promise<Repo | null> {
    // Find repo
    let repo = await this.repoRepository.findById(repoCode);
    if (!repo) {
      return null;
    }

    // Edit properties
    repo.edit(repoOptions);
    if (repoCode.toLowerCase() !== repoCode.toLowerCase()) {
      if (await this.existsRepo(repoOptions.code)) {
        throw new ValidationError([
          {
            property: "code",
            errorCode: 0,
            errorName: "Not Unique",
            errorMessage: "Repository code '" + repo.code + "' is already used",
            value: repo.code,
            required: true,
            objectClass: null
          }]);
      }
    }

    // Save and return repo
    return await this.repoRepository.save(repo);
  }

  /**
   * Get repository by repo code
   * @param {string} repoCode
   * @returns {Repo}
   */
  public getRepo(repoCode: string): Promise<Repo | null> {
    return this.repoRepository.findById(repoCode);
  }

  /**
   * Check if a repository already exists
   * @param {string} repoCode
   * @returns {boolean}
   */
  public async existsRepo(repoCode: string): Promise<boolean> {
    return await this.getRepo(repoCode) !== null;
  }

  /**
   * Get all Repositories
   * @returns {Promise<Repo[]>}
   */
  public async getRepos(): Promise<Repo[]> {
    return this.repoRepository.findAll();
  }

}