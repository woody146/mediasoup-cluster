export class MultiStreamsMixer {
  private audioContext: AudioContext;
  private audioDestination: MediaStreamAudioDestinationNode;

  constructor(private streams: MediaStream[]) {
    this.audioContext = new AudioContext();
    this.audioDestination = this.audioContext.createMediaStreamDestination();
    this.mixAudioStreams(streams);
  }

  getMixedStream() {
    return this.audioDestination.stream;
  }

  appendStreams(streams: MediaStream[]) {
    this.mixAudioStreams(streams);
  }

  private mixAudioStreams(streams: MediaStream[]) {
    streams.forEach((stream) => {
      if (stream.getTracks().some((t) => t.kind === 'audio')) {
        const audioSource = this.audioContext.createMediaStreamSource(stream);
        audioSource.connect(this.audioDestination);
      }
    });
  }
}
