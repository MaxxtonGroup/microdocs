import * as fs from 'fs';
import * as path from 'path';
import { Config } from "../config";

/**
 * Remove empty folders in directory
 * @param path
 * @param isRoot
 */
export function cleanEmptyFolders(path: string, isRoot: boolean = true): void {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath: string = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        cleanEmptyFolders(curPath, false);
      }
    });
    if (!isRoot && fs.readdirSync(path).length == 0) {
      fs.rmdirSync(path);
    }
  }
}

/**
 * Remove path with sub files and folders
 * @param path
 */
export function deleteFolderRecursive(path: string): void {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

/**
 * Get folders in a directory
 * @param srcpath directory
 * @return {string[]} list of folder names
 */
export function getDirectories(dir: string): Array<string> {
  if (fs.existsSync(dir)) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  }
  return [];
}

/**
 * Get folders in a directory
 * @param srcpath directory
 * @return {string[]} list of folder names
 */
export function getFiles(dir: string): Array<string> {
  if (fs.existsSync(dir)) {
    return fs.readdirSync(dir).filter(function (file) {
      return fs.statSync(path.join(dir, file)).isFile();
    });
  }
  return [];
}

/**
 * Get a reandom folder in the given directory
 * @param dir {string} temp directory
 * @return {string} random folder
 */
export function getTempFolder(): string {
  const dir = path.join(__dirname, '../../../', Config.get('tempFolder'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // Generate random tempFOlder
  let tempFolder = path.join(dir, getRandomString());
  while (fs.existsSync(tempFolder)) {
    // Get new tempFolder if already exists
    tempFolder = path.join(dir, getRandomString());
  }
  fs.mkdir(tempFolder);
  return tempFolder;
}

/**
 * Generate random string of a specific size
 * @param size {number} size of the string
 * @return {string} random string
 */
export function getRandomString(size: number = 6): string {
  return Math.random().toString(36).substring(7).substring(0, size);
}
