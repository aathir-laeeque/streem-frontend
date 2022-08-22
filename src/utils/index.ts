export const setKeepPersistedData = (value = '') => {
  localStorage.setItem('keepPersistedData', value);
};

export const openLinkInNewTab = (link: string) => {
  setKeepPersistedData('true');
  window.open(link, '_blank');
};
