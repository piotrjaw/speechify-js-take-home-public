export enum DataType {
  HTML = "HTML",
  TXT = "TXT",
  JSON = "JSON",
}

export type Data = {
  type: DataType;
  source: string;
  data: string;
};

export type StreamChunk = string | undefined;

export interface Speechify {
  addToQueue(data: Data): boolean;
  getNextChunk(): StreamChunk | undefined;
}
