import { Data } from "@common";
import {
  ClientEventType,
  ClientState,
  DownloadingState,
  SpeechifyClient,
  SpeechifyClientEvent,
} from "@common/client";
import SpeechApiService from "./services/SpeechApiService";
import ApiService from "./services/ApiService";

export default class SpeechifyClientImpl implements SpeechifyClient {
  private state: ClientState = ClientState.NOT_PLAYING;
  private downloadingState: DownloadingState = DownloadingState.NOT_DOWNLOADING;
  private speechApiService: SpeechApiService = new SpeechApiService();
  private apiService: ApiService;

  private eventListeners: Record<
    string,
    (event: SpeechifyClientEvent) => void
  > = {};

  constructor(host: string) {
    this.apiService = new ApiService(host);
    this.speechApiService.cancel();
  }

  async addToQueue(data: Data): Promise<boolean> {
    const result: boolean = (await this.apiService.addToQueue(data)) || false;

    if (
      result &&
      this.getState() === ClientState.PLAYING &&
      this.getDownloadingState() === DownloadingState.NOT_DOWNLOADING
    ) {
      this.downloadAndProceed();
    }

    return result;
  }

  play(): void {
    this.emitState(ClientState.PLAYING);

    if (this.getDownloadingState() === DownloadingState.NOT_DOWNLOADING) {
      this.downloadAndProceed();
    }

    this.speechApiService.resumeIfPending();
  }

  pause(): void {
    this.emitState(ClientState.NOT_PLAYING);

    this.speechApiService.pause();
  }

  getState(): ClientState {
    return this.state;
  }

  getDownloadingState(): DownloadingState {
    return this.downloadingState;
  }

  subscribe(listener: (event: SpeechifyClientEvent) => void): () => void {
    const key = listener.toString();

    this.eventListeners[key] = listener;
    return () => {
      delete this.eventListeners[key];
    };
  }

  private emitState(state: ClientState): void {
    this.state = state;
    Object.values(this.eventListeners).forEach((listener) =>
      listener({ type: ClientEventType.STATE, state })
    );
  }

  private async downloadAndProceed() {
    this.downloadingState = DownloadingState.DOWNLOADING;
    const result = await this.apiService.getNextChunk();

    if (result && result.chunk) {
      this.speechApiService.addToQueue(result.chunk, this.pause.bind(this));
      this.downloadAndProceed();
    } else {
      this.downloadingState = DownloadingState.NOT_DOWNLOADING;

      this.speechApiService.cancelIfIdle(this.pause.bind(this));
    }
  }
}
