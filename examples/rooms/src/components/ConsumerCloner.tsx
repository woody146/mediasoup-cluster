import { useState } from 'react';

export const ConsumerCloner = ({ roomId }: { roomId: string }) => {
  const [count, setCount] = useState(0);

  const addClients = (quantity: number) => {
    console.log(roomId);
    setCount(count + quantity);
  };

  return (
    <div className="grid grid-flow-col justify-stretch mb-4" role="group">
      <button
        type="button"
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-l-md shadow-sm border-2 border-pink-500"
        data-te-ripple-init
        data-te-ripple-color="light"
      >
        Clients: {count}
      </button>
      <button
        type="button"
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-none shadow-sm border-2 border-y-pink-500"
        data-te-ripple-init
        data-te-ripple-color="light"
        onClick={() => addClients(1)}
      >
        + 1
      </button>
      <button
        type="button"
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-none shadow-sm border-2 border-l-pink-500 border-y-pink-500"
        data-te-ripple-init
        data-te-ripple-color="light"
        onClick={() => addClients(10)}
      >
        + 10
      </button>
      <button
        type="button"
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-r-md shadow-sm border-2 border-pink-500"
        data-te-ripple-init
        data-te-ripple-color="light"
        onClick={() => addClients(100)}
      >
        +100
      </button>
    </div>
  );
};
