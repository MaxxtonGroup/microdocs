import * as fs from 'fs';

/**
 * Remove empty folders in directory
 * @param path
 * @param isRoot
 */
export function cleanEmptyFolders(path:string, isRoot:boolean = true):void {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath:string = path + "/" + file;
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
export function deleteFolderRecursive(path:string):void {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}