function generatePath(urlPattern: string, params: Record<string, any>) {
  const retParams = { ...params };
  const parts = urlPattern.split('/');
  const result = [] as string[];
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i].startsWith(':')) {
      const key = parts[i].slice(1);
      result.push(encodeURIComponent(params[key]));
      delete retParams[key];
    } else {
      result.push(parts[i]);
    }
  }
  return {
    path: result.join('/'),
    params: retParams,
  };
}

export function fetchApi({
  host,
  port,
  path,
  method,
  data,
}: {
  host: string;
  port?: string | number;
  path: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
}) {
  const parsed = generatePath(path, data || {});
  let body;
  if (method === 'GET') {
    parsed.path += '?' + new URLSearchParams(parsed.params);
  } else {
    body = JSON.stringify(parsed.params);
  }
  return fetch('http://' + host + (port ? ':' + port : '') + parsed.path, {
    headers: { 'Content-Type': 'application/json' },
    method,
    body,
  }).then(async (resp) => {
    if (resp.status > 400) {
      const message = await resp.text();
      throw { code: resp.status, message };
    } else {
      return resp.json();
    }
  });
}
