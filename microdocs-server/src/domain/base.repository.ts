/**
 * Repository to preform basic operation
 */
export interface BaseRepository<T> {

  /**
   * Store model
   * @param {T} model
   * @returns {T}
   */
  save(model: T): Promise<T>;

  /**
   * Get model by Id
   * @param {ID} id
   * @returns {T}
   */
  findById(id: string): Promise<T>;

  /**
   * Get list of all model id's
   * @returns {string[]}
   */
  findAllIds(): Promise<string[]>;

  /**
   * Get list of all models
   * @returns {T[]}
   */
  findAll(): Promise<T[]>;

}