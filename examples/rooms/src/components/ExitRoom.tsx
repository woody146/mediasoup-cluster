import { fetchApi } from '../services';

export function ExitRoom({
  roomId,
  userId,
  onSuccess,
}: {
  roomId: string;
  userId: string;
  onSuccess: () => void;
}) {
  const exitRoom = async () => {
    await fetchApi({
      path: `/api/user/${userId}/logout`,
      method: 'POST',
      data: { roomId },
    });
    onSuccess();
  };

  return (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-orange-500"
      onClick={() => exitRoom()}
    >
      Exit Room
    </button>
  );
}
