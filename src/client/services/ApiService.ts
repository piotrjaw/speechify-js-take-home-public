import { Data } from "@common";
import { get, post } from "../utils/request";
import { RESOURCE_URLS } from "../consts";
import ChunkResponse from "../models/ChunkResponse";

interface ApiService {
  getNextChunk: () => Promise<ChunkResponse | null>;
  addToQueue: (data: Data) => Promise<boolean | null>;
}

export default class ApiServiceImpl implements ApiService {
  private readonly serverHost: string;

  constructor(serverHost: string) {
    this.serverHost = serverHost;
  }

  async getNextChunk(): Promise<ChunkResponse | null> {
    return await get(`${this.serverHost}/api/${RESOURCE_URLS.GET_NEXT_CHUNK}`);
  }

  async addToQueue(data: Data): Promise<boolean | null> {
    return await post(
      `${this.serverHost}/api/${RESOURCE_URLS.ADD_TO_QUEUE}`,
      data
    );
  }
}
