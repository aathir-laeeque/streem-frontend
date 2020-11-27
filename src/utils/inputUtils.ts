export const captureSupported = () => {
  const el = document.createElement('input');
  return el.capture != undefined;
};
