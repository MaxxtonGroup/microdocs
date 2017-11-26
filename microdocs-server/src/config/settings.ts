import * as yaml from "yamljs";
import * as fs from "fs";
import * as pathUtil from "path";
import * as logger from "winston";

// Load config
const configFile = pathUtil.join(process.cwd(), "settings.yml");
let config: any = {};
logger.info("load settings from " + configFile);
if (fs.existsSync(configFile)) {
  const configContent = fs.readFileSync(configFile);
  config = yaml.parse(configContent.toString());
}
logger.debug(JSON.stringify(config));

function resolve(config: any, path: string): any {
  let segments = path.split(".");
  let segment = segments.splice(0, 1)[0];
  let pathRemaining = segments.join(".");
  if(config[segment] === undefined){
    return undefined;
  }
  if (pathRemaining.length > 0) {
    return resolve(config[segment], pathRemaining);
  }
  return config[segment];
}

// Constants
export const storage = {

  ui: pathUtil.join(process.cwd(), resolve(config, "storage.ui") || "../microdocs-ui/dist"),
  driver: resolve(config, "storage.driver") || "file",
  file: {
    path: pathUtil.join(process.cwd(), resolve(config, "storage.file.path") || "storage")
  }

};