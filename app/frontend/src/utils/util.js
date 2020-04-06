
import { KcClientStatus } from '@/utils/constants';

/**
 * @function buildClientSpan
 * Returns the appropriate DOM for client Available or Not available (wording and CSS)
 * @param {string} envLabel Which environment (DEV, TEST, PROD)
 * @param {boolean} status Whether the service client is there
 * @returns {string} HTML
 */
export function buildClientStatusSpan(envLabel, status) {
  const cls = status ? 'green--text' : '';
  const txt = status ? KcClientStatus.AVAILABLE : KcClientStatus.NOT;
  return `${envLabel}: <span class="${cls}">${txt}</span>`;
}
