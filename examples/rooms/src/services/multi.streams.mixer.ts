export class MultiStreamsMixer {
  videos: Array<any>;
  isStopDrawingFrames: boolean;
  canvas: any;
  context: CanvasRenderingContext2D;
  disableLogs: boolean;
  frameInterval: number;
  width: number;
  height: number;
  useGainNode: boolean;
  arrayOfMediaStreams: Array<MediaStream>;
  elementClass: string;
  /********************************************/
  audioContext: any;
  audioDestination: any;
  audioSources: Array<any>;
  gainNode?: GainNode;

  constructor(
    _arrayOfMediaStreams: Array<MediaStream>,
    elementClass = 'multi-streams-mixer'
  ) {
    // requires: chrome://flags/#enable-experimental-web-platform-features
    this.arrayOfMediaStreams = _arrayOfMediaStreams;
    this.elementClass = elementClass;
    this.videos = new Array<any>();
    this.isStopDrawingFrames = false;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.style =
      'opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000; margin-top:-1000000000;margin-left:-1000000000;';
    this.canvas.className = this.elementClass;
    (document.body || document.documentElement).appendChild(this.canvas);
    this.disableLogs = false;
    this.frameInterval = 10;
    this.width = 360;
    this.height = 240;
    this.useGainNode = true;
    this.audioContext = undefined;
    this.audioSources = [];
  }

  private isPureAudio() {
    for (let i = 0; i < this.arrayOfMediaStreams.length; i++) {
      if (
        this.arrayOfMediaStreams[i].getTracks().filter(function (t) {
          return t.kind === 'video';
        }).length > 0
      )
        return false;
    }
    return true;
  }

  getAudioContext(): AudioContext {
    if (typeof AudioContext !== 'undefined') {
      return new AudioContext();
    } else if (typeof (<any>window).webkitAudioContext !== 'undefined') {
      return new (<any>window).webkitAudioContext();
    } else if (typeof (<any>window).mozAudioContext !== 'undefined') {
      return new (<any>window).mozAudioContext();
    }
    throw new Error('Not support AudioContext');
  }

  /**************************************************/

  private setSrcObject(stream: MediaStream, element: any) {
    const URL = window.URL || (<any>window).webkitURL;
    if ('srcObject' in element) {
      element.srcObject = stream;
    } else if ('mozSrcObject' in element) {
      element.mozSrcObject = stream;
    } else if ('createObjectURL' in URL) {
      element.src = URL.createObjectURL(stream as any);
    } else {
      throw new Error('createObjectURL/srcObject both are not supported.');
    }
  }

  public startDrawingFrames() {
    this.drawVideosToCanvas();
  }

  private drawVideosToCanvas() {
    if (this.isStopDrawingFrames) {
      return;
    }
    const videosLength = this.videos.length;
    let fullcanvas: any = undefined;
    const remaining: any[] = [];
    this.videos.forEach((video) => {
      if (!video.stream) {
        video.stream = {};
      }
      if (video.stream.fullcanvas) {
        fullcanvas = video;
      } else {
        remaining.push(video);
      }
    });

    if (fullcanvas !== undefined) {
      this.canvas.width = fullcanvas.stream.width;
      this.canvas.height = fullcanvas.stream.height;
    } else if (remaining.length) {
      this.canvas.width =
        videosLength > 1 ? remaining[0].width * 2 : remaining[0].width;
      let height = 1;
      if (videosLength === 3 || videosLength === 4) {
        height = 2;
      }
      if (videosLength === 5 || videosLength === 6) {
        height = 3;
      }
      if (videosLength === 7 || videosLength === 8) {
        height = 4;
      }
      if (videosLength === 9 || videosLength === 10) {
        height = 5;
      }
      this.canvas.height = remaining[0].height * height;
    } else {
      this.canvas.width = this.width || 360;
      this.canvas.height = this.height || 240;
    }

    if (fullcanvas && fullcanvas instanceof HTMLVideoElement) {
      this.drawImage(fullcanvas, 0);
    }

    remaining.forEach((video, idx) => {
      this.drawImage(video, idx);
    });

    setTimeout(this.drawVideosToCanvas.bind(this), this.frameInterval);
  }

  private drawImage(video: any, idx: any) {
    if (this.isStopDrawingFrames) {
      return;
    }

    let x = 0;
    let y = 0;
    let width = video.width;
    let height = video.height;

    if (idx === 1) {
      x = video.width;
    }

    if (idx === 2) {
      y = video.height;
    }

    if (idx === 3) {
      x = video.width;
      y = video.height;
    }

    if (idx === 4) {
      y = video.height * 2;
    }

    if (idx === 5) {
      x = video.width;
      y = video.height * 2;
    }

    if (idx === 6) {
      y = video.height * 3;
    }

    if (idx === 7) {
      x = video.width;
      y = video.height * 3;
    }

    if (typeof video.stream.left !== 'undefined') {
      x = video.stream.left;
    }

    if (typeof video.stream.top !== 'undefined') {
      y = video.stream.top;
    }

    if (typeof video.stream.width !== 'undefined') {
      width = video.stream.width;
    }

    if (typeof video.stream.height !== 'undefined') {
      height = video.stream.height;
    }
    this.context.drawImage(video, x, y, width, height);
    if (typeof video.stream.onRender === 'function') {
      video.stream.onRender(this.context, x, y, width, height, idx);
    }
  }

  getMixedStream() {
    this.isStopDrawingFrames = false;
    const mixedAudioStream = this.getMixedAudioStream();
    const mixedVideoStream = this.isPureAudio()
      ? undefined
      : this.getMixedVideoStream();
    if (mixedVideoStream === undefined) {
      return mixedAudioStream;
    } else {
      if (mixedAudioStream) {
        mixedAudioStream
          .getTracks()
          .filter(function (t: any) {
            return t.kind === 'audio';
          })
          .forEach((track: any) => {
            mixedVideoStream.addTrack(track);
          });
      }
      return mixedVideoStream;
    }
  }

  private getMixedVideoStream() {
    this.resetVideoStreams();
    const capturedStream =
      this.canvas.captureStream() || this.canvas.mozCaptureStream();
    const videoStream = new MediaStream();
    capturedStream
      .getTracks()
      .filter(function (t: any) {
        return t.kind === 'video';
      })
      .forEach((track: any) => {
        videoStream.addTrack(track);
      });
    this.canvas.stream = videoStream;
    return videoStream;
  }

  private getMixedAudioStream() {
    // via: @pehrsons
    if (this.audioContext === undefined) {
      this.audioContext = this.getAudioContext();
    }
    this.audioSources = new Array<any>();
    if (this.useGainNode === true) {
      this.gainNode = this.audioContext.createGain();
      if (this.gainNode) {
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 0; // don't hear self
      }
    }

    let audioTracksLength = 0;
    this.arrayOfMediaStreams.forEach((stream) => {
      if (
        !stream.getTracks().filter(function (t) {
          return t.kind === 'audio';
        }).length
      ) {
        return;
      }
      audioTracksLength++;
      const _audioSource = this.audioContext.createMediaStreamSource(stream);
      if (this.useGainNode === true) {
        _audioSource.connect(this.gainNode);
      }
      this.audioSources.push(_audioSource);
    });

    if (!audioTracksLength) {
      return undefined;
    }
    this.audioDestination = this.audioContext.createMediaStreamDestination();
    this.audioSources.forEach((_audioSource) => {
      _audioSource.connect(this.audioDestination);
    });
    return this.audioDestination.stream;
  }

  private getVideo(stream: any) {
    const video = document.createElement('video');
    this.setSrcObject(stream, video);
    video.className = this.elementClass;
    video.muted = true;
    video.volume = 0;
    video.width = stream.width || this.width || 360;
    video.height = stream.height || this.height || 240;
    video.play();
    return video;
  }

  appendStreams(streams: MediaStream[]) {
    if (!streams) {
      throw 'First parameter is required.';
    }

    if (!(streams instanceof Array)) {
      streams = [streams];
    }

    this.arrayOfMediaStreams.concat(streams);
    streams.forEach((stream) => {
      if (
        stream.getTracks().filter(function (t: any) {
          return t.kind === 'video';
        }).length
      ) {
        const video: any = this.getVideo(stream);
        video.stream = stream;
        this.videos.push(video);
      }

      if (
        stream.getTracks().filter(function (t: any) {
          return t.kind === 'audio';
        }).length &&
        this.audioContext
      ) {
        const audioSource = this.audioContext.createMediaStreamSource(stream);
        audioSource.connect(this.audioDestination);
        this.audioSources.push(audioSource);
      }
    });
  }

  private resetVideoStreams(streams?: any) {
    if (streams && !(streams instanceof Array)) {
      streams = [streams];
    }

    this._resetVideoStreams(streams);
  }

  private _resetVideoStreams(streams: any[]) {
    this.videos = [];
    streams = streams || this.arrayOfMediaStreams;

    // via: @adrian-ber
    streams.forEach((stream) => {
      if (
        !stream.getTracks().filter(function (t: any) {
          return t.kind === 'video';
        }).length
      ) {
        return;
      }
      const tempVideo: any = this.getVideo(stream);
      tempVideo['stream'] = stream;
      this.videos.push(tempVideo);
    });
  }
}
