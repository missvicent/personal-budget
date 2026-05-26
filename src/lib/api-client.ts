export type RequestOptions = {
  token: string
  signal?: AbortSignal
  params?: Record<string, string>
}

export type RequestFn = <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  opts: RequestOptions & { body?: unknown },
) => Promise<T>

const apiUrl = import.meta.env.VITE_API_URL

const request: RequestFn = async (method, path, opts) => {
  const { token, signal, params } = opts
  const url = new URL(path, apiUrl)

  const newUrl = setParams(url, params || {})
  const headers = setHeaders(new Headers(), token, !!opts.body)

  const response = await fetch(newUrl.toString(), {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal,
  })

  return handleResponse(response)
}

const handleError = async (response: Response) => {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`HTTP error! status: ${response.status}: ${body}`)
  }
}

const handleResponse = async (response: Response) => {
  await handleError(response)
  if (response.status === 204) return undefined
  return response.json()
}

const setHeaders = (headers: Headers, token: string, hasBody: boolean) => {
  if (hasBody) headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${token}`)
  return headers
}

const setParams = (url: URL, params: Record<string, string>) => {
  if (Object.keys(params).length === 0) return url
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url
}

export const apiClient = {
  get: <T>(path: string, opts: RequestOptions) => request<T>('GET', path, opts),
  post: <T>(path: string, opts: RequestOptions & { body?: unknown }) =>
    request<T>('POST', path, opts),
  put: <T>(path: string, opts: RequestOptions & { body?: unknown }) =>
    request<T>('PUT', path, opts),
  delete: <T>(path: string, opts: RequestOptions) =>
    request<T>('DELETE', path, opts),
}
