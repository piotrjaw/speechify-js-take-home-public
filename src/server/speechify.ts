import { Data, StreamChunk } from "@common";
import { SpeechifyServer } from "@common/server";
import parsers from "./parsers";

export default class MySpeechify implements SpeechifyServer {
  private queue: Data[] = [];

  addToQueue(data: Data): boolean {
    console.log(
      `Received data of type ${data.type} from source ${data.source}, trying to parse.`
    );
    try {
      this.queue.unshift(this.parseData(data));
      console.log('Parsing successful!');
      return true;
    } catch (e) {
      console.error(`Failed parsing, reason: ${e}`);
      return false;
    }
  }

  getNextChunk(): StreamChunk | undefined {
    console.log("Received data request.");
    const nextParsedData: Data | undefined = this.queue.pop();
    if (!nextParsedData) {
      console.log("No more data to process, returning empty.");
      return undefined;
    }

    console.log(
      `Sending parsed data of type ${nextParsedData.type} from source ${nextParsedData.source}`
    );
    return nextParsedData.data;
  }

  private parseData(data: Data): Data {
    if (!parsers[data.type])
      throw new Error(`No parsed defined for type: ${data.type}`);

    return {
      ...data,
      data: parsers[data.type](data.data),
    };
  }
}
