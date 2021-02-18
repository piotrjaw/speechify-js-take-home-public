interface SpeechApiService {
  addToQueue: (text: string, callback: () => void) => void;
  cancelIfIdle: (callback: () => void) => void;
  resumeIfPending: () => void;
  pause: () => void;
  cancel: () => void;
}

export default class SpeechApiServiceImpl implements SpeechApiService {
  addToQueue = (text: string, callback: () => void): void => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      if (!speechSynthesis.speaking && !speechSynthesis.pending) {
        callback();
        speechSynthesis.cancel();
      }
    };

    speechSynthesis.speak(utterance);
  };

  cancelIfIdle = (callback: () => void): void => {
    if (!speechSynthesis.pending && !speechSynthesis.speaking) {
      speechSynthesis.cancel();
      callback();
    }
  };

  resumeIfPending = (): void => {
    if (speechSynthesis.pending || speechSynthesis.speaking) {
      speechSynthesis.resume();
    }
  };

  pause = (): void => {
    speechSynthesis.pause();
  };

  cancel = (): void => {
    speechSynthesis.cancel();
  };
}
