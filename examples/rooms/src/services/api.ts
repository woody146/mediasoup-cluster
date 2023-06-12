export const fetchApi = ({
  path,
  method,
  data,
}: {
  path: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'GET';
  data?: any;
}) => {
  let body;
  if (method === 'GET') {
    path += '?' + new URLSearchParams(data);
  } else {
    body = JSON.stringify(data || {});
  }
  return fetch(path, {
    method,
    body,
    headers: { 'Content-Type': 'application/json' },
  }).then((resp) => resp.json());
};
