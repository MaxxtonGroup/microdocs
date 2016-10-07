export class CrawlerException extends Error {

  constructor(msg: string, error?: Error) {
    var outputMessage = msg;
    if (error) {
      outputMessage += ".\ncaused by: " + error.message;
      if (error['stack']) {
        outputMessage += "\n" + error['stack'];
      }
    }
    super(outputMessage);
  }

}