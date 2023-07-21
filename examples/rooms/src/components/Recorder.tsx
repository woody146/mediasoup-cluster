import { useState } from 'react';

export function Recorder({
  stream,
  type,
}: {
  stream: MediaStream;
  type: 'audio' | 'video';
}) {
  const [count, setCount] = useState(0);
  const [recorder, setRecorder] = useState<MediaRecorder>();

  const start = () => {
    try {
      const recordData = [] as any[];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        setCount((c) => c + event.data.size);
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
      setCount(0);
    } catch (e: any) {
      alert(e.toString());
    }
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
      Stop{' '}
      {`(record ${Intl.NumberFormat('en', { notation: 'compact' }).format(
        count
      )})`}
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
