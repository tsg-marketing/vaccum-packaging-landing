const YA_COUNTER = 105605669;

type YmFn = (...args: unknown[]) => void;

function fromCookie(): string {
  const m = document.cookie.match(/(?:^|;\s*)_ym_uid=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export function getYaClientId(): Promise<string> {
  return new Promise((resolve) => {
    const ym = (window as unknown as { ym?: YmFn }).ym;
    if (typeof ym !== 'function') return resolve(fromCookie());

    let done = false;
    const finish = (v: string) => {
      if (!done) {
        done = true;
        resolve(v || fromCookie());
      }
    };

    try {
      ym(YA_COUNTER, 'getClientID', (id: unknown) => finish(String(id ?? '')));
    } catch (e) {
      finish('');
    }

    setTimeout(() => finish(''), 600);
  });
}
