import {
  createCookieSessionStorageFactory,
  createCookieFactory,
  type SessionStorage,
  type Session,
} from '@remix-run/server-runtime';

import type {SignFunction, UnsignFunction} from '@remix-run/server-runtime';

const encoder = new TextEncoder();

export const sign: SignFunction = async (value, secret) => {
  const data = encoder.encode(value);
  const key = await createKey(secret, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
    /=+$/,
    '',
  );

  return value + '.' + hash;
};

export const unsign: UnsignFunction = async (cookie, secret) => {
  const value = cookie.slice(0, cookie.lastIndexOf('.'));
  const hash = cookie.slice(cookie.lastIndexOf('.') + 1);

  const data = encoder.encode(value);
  const key = await createKey(secret, ['verify']);
  const signature = byteStringToUint8Array(atob(hash));
  const valid = await crypto.subtle.verify('HMAC', key, signature, data);

  return valid ? value : false;
};

async function createKey(
  secret: string,
  usages: CryptoKey['usages'],
): Promise<CryptoKey> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    usages,
  );

  return key;
}

function byteStringToUint8Array(byteString: string): Uint8Array {
  const array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  return array;
}

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class HydrogenSession {
  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const createCookie = createCookieFactory({sign, unsign});
    const createCookieSessionStorage =
      createCookieSessionStorageFactory(createCookie);
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  get(key: string) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key: string, value: any) {
    this.session.flash(key, value);
  }

  unset(key: string) {
    this.session.unset(key);
  }

  set(key: string, value: any) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}
