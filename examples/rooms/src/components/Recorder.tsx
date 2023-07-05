import { useState } from 'react';

export function Recorder({
  stream,
  type,
}: {
  stream: MediaStream;
  type: 'audio' | 'video';
}) {
  const [recorder, setRecorder] = useState<MediaRecorder>();

  const start = () => {
    const recordData = [] as any[];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType:
        type === 'audio'
          ? 'audio/webm;codecs=opus'
          : 'video/webm;codecs=vp9,opus',
    });
    mediaRecorder.ondataavailable = (event) => {
      console.log(event.data);
      recordData.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'test.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };
    mediaRecorder.start(3000);
    setRecorder(mediaRecorder);
  };

  const stop = () => {
    if (recorder) {
      recorder.stop();
    }
    setRecorder(undefined);
  };

  return recorder ? (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-orange-500"
      onClick={() => stop()}
    >
      Stop
    </button>
  ) : (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-green-500"
      onClick={() => start()}
    >
      Record {type}
    </button>
  );
}
