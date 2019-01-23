// @flow
import {
  store,
  USER_VXC as U_VXC,
  NOTIFICATIONS_VXC as N_VXC,
  vxcFp,
} from '@/store';

import type { VuexUserState } from '@/store/user/types';
import {
  getDate,
  downloadFile,
} from '@/utils';
import { messageLevels } from '@/services/ws_notifications/types';

type FetchDataParams = {
  request: Request,
  isLogin?: boolean,
  isBlob?: boolean,
}

type BlobResponse = {
  blob: Blob,
  filename: string
}

type User = {
  userId: number,
  name: string,
};

type LoginResponse = {
  user: User,
  isAdminRole: boolean,
  localPort: number,
  serverTime: string,
  wsReconnectInterval: number,
  wsMaxReconnectAttempts: number,
  wsClientInactivityTimeout: number,
}

const HTTP_STATUS_NO_CONTENT = 204;

// The location header contains a path that can be passed to
// the http.get method to obtain the object that was created
// (or info on it - exactly what gets returned from the server is implementation
// dependent).
const HTTP_STATUS_CREATED = 201;

let secSessionId: string = '';
let actualRemoteServerPort: number;
let timeDeltaInMillis : number = 0;
let reconnectInternalInMillis = 0;
let maxReconnectAttempts = 0;
let clientInactivityTimeoutInMillis = 0;

export function serverTimeDeltaInMillis() {
  return timeDeltaInMillis;
}

export function getWsClientInactivityTimeoutInMillis() : number {
  return clientInactivityTimeoutInMillis;
}

export function getWsReconnectInterval() : number {
  return reconnectInternalInMillis;
}

export function getWsMaxReconnectAttempts() : number {
  return maxReconnectAttempts;
}

export function getUrlForWebsocketEndpoint(endpoint : string) : string {
  const loc = window.location;
  const protocol : string = loc.protocol === 'http:' ? 'ws:' : 'wss:';
  const restPort : number = +loc.port;
  // A bit of a kluge to accomodate the WebPack dev server WS proxy
  const wsPort = restPort + (restPort === actualRemoteServerPort ? 1 : 0);
  console.log(restPort);
  console.log(wsPort);
  const host = 'worldmodelers.com';
  const proxyport = 4569;

  return `${protocol}//${host}:${proxyport}/ws/${endpoint}?SEC_SESSION_ID=${secSessionId}`;
}

function getHeaderValue(headers: Headers, key: string) : string {
  try {
    const value : string = headers.get(key);
    if (value !== null) {
      return value;
    }

    // noinspection ExceptionCaughtLocallyJS eslint-disable-next-line semi
    throw Error('value not set');
  } catch (err) {
    throw Error(`${key} not found in response header: ${err.message}`);
  }
}

function getFilenameFromHeader(headers: Headers) : string {
  const key = 'Content-Disposition';
  const fnmPrefix = 'filename=';
  const headerValue = getHeaderValue(headers, key);
  const arr = headerValue.split(fnmPrefix);
  if (arr && arr.length === 2) {
    return arr[1];
  }
  throw Error(`Response header for key ${key} `
              + `did not include '${fnmPrefix}' with value: ${headerValue}'`);
}

function isProcessingException(headers: Headers) {
  try {
    const value : string = headers.get('USER_MESSAGE_EXCEPTION');
    return value === 'true';
  } catch (err) {
    return false;
  }
}

function saveLoginHeaders(headers : Headers) : void {
  secSessionId = getHeaderValue(headers, 'SEC_SESSION_ID');
}

type HeadersAndBody = {
  headers: Headers,
  body?: any,
};

function getHeadersAndBody(body?: any) : HeadersAndBody {
  const headers : Headers = new Headers();
  let bodyData;
  if (typeof body === 'object' && !(body instanceof FormData)) {
    bodyData = JSON.stringify(body);
    headers.append('Content-Type', 'application/json');
  } else {
    bodyData = body;
  }

  headers.append('SEC_SESSION_ID', secSessionId);

  if (bodyData !== undefined && bodyData !== null) {
    return { headers, body: bodyData };
  }
  return { headers };
}

function ErrorResponseException(
  userMessage: string,
  techMessage: ?string,
  displayOnlyUserMessage: boolean,
) {
  this.userMessage = userMessage;
  this.techMessage = techMessage;
  this.displayOnlyUserMessage = displayOnlyUserMessage;
}

async function fetchData(params: FetchDataParams) : Promise<Object> {
  let response : ?Response = null;

  try {
    response = await fetch(params.request);
    let body = {};
    let blob: ?Blob;

    if (response.status === HTTP_STATUS_CREATED) {
      body.location = getHeaderValue(response.headers, 'LOCATION');
    } else if (response.status !== HTTP_STATUS_NO_CONTENT) {
      try {
        if (params.isBlob && response.ok) {
          blob = await response.blob();
        } else {
          body = await response.json();
        }
      } catch (e) {
        if (response.ok) {
          // Many errors (504, etc) will not contain a body message,
          // so, don't bother to display a json parse error.
          // eslint-disable-next-line no-console
          console.error(`Error ${params.isBlob ? 'loading blob' : 'parsing json'}: ${e.message}`);
        }
      }
    }

    if (response.ok) {
      if (params.isLogin) {
        saveLoginHeaders(response.headers);
      }

      if (blob) {
        return {
          blob,
          filename: getFilenameFromHeader(response.headers),
        };
      }

      return body;
    }
    // An ErrorResponseMessage is returned for all execeptions thrown
    // from the server that are under programmer control. Some are exceptions
    // where we only want the 'message' field to be displayed to to the user,
    // and may also include a 'techMessage' field that should be logged,
    // but not normally displayed. These exception messages will have a
    // special flag set in the header.
    //
    // noinspection ExceptionCaughtLocallyJS
    throw new ErrorResponseException(
      body.message || '',
      body.techMessage,
      isProcessingException(response.headers),
    );
    // const msg : string = body.message ? `: ${body.message}` : '';
  } catch (e) {
    let msg = '';

    // The Fetch API fails if it can't make a request, in which case,
    // it does not return a response object. In our case, this will
    // probably only happen if the server is not available.
    // So, return a message that is more meaningful for the user.
    if (!response && e instanceof TypeError) {
      if (e.message && e.message.toLowerCase() === 'failed to fetch') {
        msg = ': Cannot connect to the server';
      }
    } else if (e instanceof ErrorResponseException) {
      msg = `: ${e.userMessage}`;
      if (e.techMessage) {
        msg += `: ${e.techMessage}`;
      }
    } else if (e.message) {
      msg = `: ${e.message}`;
    }
    const respStatus = response ?
      `: HTTP Status (${response.status}): ${response.statusText}` : '';
    let err : string = `Error getting data${respStatus}${msg}`;
    // eslint-disable-next-line no-console
    console.error(err);

    if (e instanceof ErrorResponseException && e.displayOnlyUserMessage) {
      err = e.userMessage;
    }

    store.commit(vxcFp(N_VXC, N_VXC.SET.ADD_HTTP_ERROR), err);
    store.commit(
      vxcFp(N_VXC, N_VXC.SET.ADD_NOTIFICATION_FOR_UI),
      {
        date: getDate(),
        level: messageLevels.ERROR,
        text: err,
      },
    );
    return Promise.reject(err);
  }
}

export function toApiUrl(path:string) : string {
  return `${window.location.origin}/api/${path}`;
}

export function toAdminUrl(path:string) : string {
  return `${window.location.origin}/admin/${path}`;
}

export const http = {
  login(body : { }) : Promise<Object> {
    const req : Request = new Request(toApiUrl('login'), {
      method: 'POST',
      mode: 'cors',
      ...getHeadersAndBody(body),
    });
    return fetchData({ request: req, isLogin: true }).then((data: Object) => {
      const loginResponse: LoginResponse = data;
      const serverTime : Date = new Date(loginResponse.serverTime);
      timeDeltaInMillis = serverTime.getTime() - Date.now();

      actualRemoteServerPort = loginResponse.localPort;
      reconnectInternalInMillis = loginResponse.wsReconnectInterval;
      maxReconnectAttempts = loginResponse.wsMaxReconnectAttempts;
      clientInactivityTimeoutInMillis = loginResponse.wsClientInactivityTimeout;

      const loggedInData: VuexUserState = {
        isLoggedIn: true,
        userId: loginResponse.user.userId,
        name: loginResponse.user.name,
        isAdminRole: loginResponse.isAdminRole,
      };

      store.commit(vxcFp(U_VXC, U_VXC.SET.LOGGED_IN), loggedInData);
      return data;
    });
  },
  logout() : void {
    store.commit(vxcFp(U_VXC, U_VXC.SET.LOGGED_OUT));
    const req : Request = new Request(toApiUrl('logout'), {
      method: 'POST', mode: 'cors', ...getHeadersAndBody(),
    });
    fetchData({ request: req }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(`Error on logout request: ${e.message}`);
    });
  },
  download(path: string, body?: { }) : Promise<Object> {
    const req : Request = new Request(path, {
      method: 'POST', mode: 'cors', ...getHeadersAndBody(body),
    });
    return fetchData({ request: req, isBlob: true }).then((resp: BlobResponse) => {
      downloadFile(URL.createObjectURL(resp.blob), resp.filename);
      return { filename: resp.filename };
    });
  },
  post(path: string, body: { }) {
    const req : Request = new Request(path, {
      method: 'POST', mode: 'cors', ...getHeadersAndBody(body),
    });
    return fetchData({ request: req });
  },
  get(path: string) {
    const req : Request = new Request(path, {
      method: 'GET', mode: 'cors', ...getHeadersAndBody(),
    });
    return fetchData({ request: req });
  },
  put(path: string, body: { }) {
    const req : Request = new Request(path, {
      method: 'PUT', mode: 'cors', ...getHeadersAndBody(body),
    });
    return fetchData({ request: req });
  },
  delete(path:string) {
    const req : Request = new Request(path, {
      method: 'DELETE', mode: 'cors', ...getHeadersAndBody(),
    });
    return fetchData({ request: req });
  },
};