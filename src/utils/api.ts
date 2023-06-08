export function fetchApi({
  host,
  port,
  path,
  method,
}: {
  host: string;
  port?: string | number;
  path: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
}) {
  return fetch('http://' + host + (port ? ':' + port : '') + path, {
    method,
  }).then(async (resp) => {
    if (resp.status > 400) {
      const message = await resp.text();
      throw { code: resp.status, message };
    } else {
      return resp.json();
    }
  });
}
