const baseUrl = 'http://api.streem.leucinetech.com/api/v1';

export default class Api {
  static getChecklists() {
    const url = baseUrl + '/checklist';

    return fetch(url, { method: 'GET', mode: 'no-cors' });
  }
}
