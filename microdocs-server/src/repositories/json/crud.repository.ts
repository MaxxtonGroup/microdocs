import { BaseRepository } from "../../domain/base.repository";
import * as pathUtil from "path";
import * as fs from "fs";
import * as logger from "winston";
import * as mkdirp from "mkdirp";

/**
 * Basic Crud Repository for file based storage
 * This repository persists models in JSON files
 */
export abstract class CrudRepository<T> implements BaseRepository<T> {

  constructor(private storageFolder: string) {
  }

  /**
   * Save model as document
   * @param {T} model
   * @returns {Promise<T>}
   */
  public save(model: T): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = pathUtil.join(this.storageFolder, this.getId(model) + this.getExt());
        logger.silly("store document: " + filePath);

        let jsonDocument = this.serialize(model);
        this.makeParentDir(filePath).then(() => {
          fs.writeFile(filePath, jsonDocument, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(model);
            }
          });
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   *
   * @param {string} id
   * @returns {Promise<T>}
   */
  findById(id: string): Promise<T> {
    return new Promise( ( resolve, reject ) => {
      try {
        let filePath = pathUtil.join( this.storageFolder, id.toLowerCase() + this.getExt() );
        logger.silly( "load document: " + filePath );

        fs.exists( filePath, exists => {
          if ( exists ) {
            fs.readFile( filePath, ( err, data ) => {
              if ( err ) {
                reject( err );
              } else {
                let script = JSON.parse(data.toString());
                resolve( script );
              }
            } );
          } else {
            resolve( null );
          }
        } );
      } catch ( e ) {
        reject( e );
      }
    } );
  }

  /**
   * Find all document names
   * @returns {Promise<string[]>}
   */
  findAllIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        let folder = pathUtil.join(this.storageFolder);
        fs.exists(folder, exists => {
          if (exists) {
            fs.readdir(folder, (err, fileNames) => {
              if (err) {
                reject(err);
              } else {
                let scriptNames = fileNames
                  .filter(fileName => fileName.endsWith(this.getExt()))
                  .map(fileName => fileName.replace(this.getExt(), "").toLowerCase());
                resolve(scriptNames);
              }
            });
          } else {
            resolve([]);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async findAll(): Promise<T[]> {
    let ids = await this.findAllIds();
    let promises = ids.map(id => this.findById(id));
    return Promise.all(promises);
  }

  /**
   * Get file extension
   * @returns {string}
   */
  protected getExt(): string {
    return ".json";
  }

  /**
   * Get Id from model
   * @param {T} model
   * @returns {string}
   */
  protected abstract getId(model: T): string;

  /**
   * Serialize model
   * @param {T} model
   * @returns {string}
   */
  protected serialize(model: T): string {
    return JSON.stringify(model);
  }

  /**
   * Deserialize model
   * @param {string} data
   * @returns {T}
   */
  protected abstract deserialize(data: string): T;

  /**
   * Create parent folder of a path
   * @param {string} path
   * @returns {string}
   */
  private makeParentDir( path: string ): Promise<void> {
    return new Promise<void>( ( resolve, reject ) => {
      let dir = pathUtil.parse( path ).dir;
      mkdirp( dir, err => {
        if ( err ) {
          reject( err );
        } else {
          resolve();
        }
      } );
    } );
  }


}