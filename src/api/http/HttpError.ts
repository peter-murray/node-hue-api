export default class HttpError extends Error {

  public readonly status: number;

  public readonly url: string;

  public readonly headers?: { [k: string]: string[] };

  public readonly data?: string;

  constructor(status: number, url: string, headers?: { [k: string]: string[] }, data?: any) {
    super();

    this.status = status;
    this.url = url;
    this.headers = headers;
    this.data = data;

    this.message = `HTTP error status: ${status}${data ? '; ' + JSON.stringify(data) : ''}`;
  }
}