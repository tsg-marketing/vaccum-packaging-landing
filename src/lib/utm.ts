const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export function getUtmFromCookies(): Record<string, string> {
  const result: Record<string, string> = {};
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (UTM_PARAMS.includes(key) && value) {
      result[key] = decodeURIComponent(value);
    }
  }
  return result;
}
