import { Rectangle } from 'electron';

const { desktopCapturer } = window;

export const captureRegionOfScreen = async (
  regionBounds: Rectangle,
  screenBounds: Rectangle,
) => {
  return new Promise<string>(async (resolve, reject) => {
    const {
      height: regionHeight,
      width: regionWidth,
      x: regionX,
      y: regionY,
    } = regionBounds;
    const { height: screenHeight, width: screenWidth } = screenBounds;

    const displayId = window.remote.screen.getDisplayMatching(screenBounds).id;

    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
    });

    console.log(sources);

    const displaySource = sources.find(
      (source) => `${source.display_id}` === `${displayId}`,
    );

    console.log(displaySource);

    // Filter: main screen
    if (displaySource) {
      try {
        const stream: MediaStream = await (navigator.mediaDevices
          .getUserMedia as any)({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: displaySource.id,
              minWidth: screenWidth,
              maxWidth: screenWidth,
              minHeight: screenHeight,
              maxHeight: screenHeight,
            },
          },
        });

        // Create hidden video tag
        var video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

        video.onloadedmetadata = async () => {
          // Set video ORIGINAL height (screenshot)
          video.style.height = `${screenHeight}px`;
          video.style.width = `${screenWidth}px`;
          video.play();

          // Create canvas
          var canvas = document.createElement('canvas');
          canvas.height = regionHeight;
          canvas.width = regionWidth;

          // Draw video on canvas
          var ctx = canvas.getContext('2d');
          // ctx && ctx.drawImage(video, x, y, width, height, 0, 0, width, height);
          if (ctx) {
            // await window.ipcRenderer.invoke('hide-focused-window');

            ctx.drawImage(
              video,
              regionX,
              regionY,
              regionWidth,
              regionHeight,
              0,
              0,
              regionWidth,
              regionHeight,
            );
            // await window.ipcRenderer.invoke('show-focused-window');
          }

          const uri = canvas.toDataURL('image/jpeg', 0.8);

          // Remove hidden video tag
          video.remove();
          try {
            // Destroy connect to stream
            stream.getTracks()[0].stop();
          } catch (e) {}

          resolve(uri);
        };

        video.srcObject = stream;

        document.body.appendChild(video);
      } catch (e) {
        reject(e);
      }
    } else {
      reject('Could not get display source.');
    }
  });
};
