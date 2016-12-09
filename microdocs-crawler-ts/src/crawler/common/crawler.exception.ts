export class CrawlerException extends Error {

  constructor(msg: string, error?: Error) {
    var outputMessage = msg;
    if (error) {
      outputMessage += ".\ncaused by: " + error.toString();
    }
    super(outputMessage);
  }

}