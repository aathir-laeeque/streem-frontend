export const getVideoDevices = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = allDevices.filter(({ kind }) => kind === 'videoinput');
  const tracks = stream.getTracks();

  for (let i = 0; i < tracks.length; i++) {
    let track = tracks[i];
    track.stop();
  }
  return videoDevices || [];
};
