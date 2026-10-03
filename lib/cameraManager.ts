/**
 * Global Camera Hardware & WebRTC Stream Manager for FACE-OFF
 * Enforces immediate hardware shutdown & extinguishes camera LED / Chrome recording indicators.
 */

const activeStreams = new Set<MediaStream>();

/**
 * Registers a newly created MediaStream so it can be tracked globally.
 */
export function registerActiveStream(stream: MediaStream): void {
  activeStreams.add(stream);

  // Auto-clean stream when all tracks naturally end
  stream.getTracks().forEach((track) => {
    track.onended = () => {
      activeStreams.delete(stream);
    };
  });
}

/**
 * MASTER HARDWARE SHUTDOWN: Immediately stops all webcam tracks across the entire browser window
 */
export function stopAllWebcamHardware(): void {
  // 1. Stop all registered MediaStreams & MediaStreamTracks
  activeStreams.forEach((stream) => {
    try {
      stream.getTracks().forEach((track) => {
        track.enabled = false; // Mute hardware sensor immediately
        track.stop();          // Terminate WebRTC hardware session
      });
    } catch (e) {
      console.error('Error stopping track:', e);
    }
  });
  activeStreams.clear();

  // 2. Query all video elements in DOM and detach media sources
  if (typeof document !== 'undefined') {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((video) => {
      try {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((t) => {
            t.enabled = false;
            t.stop();
          });
          video.srcObject = null;
        }
        video.pause();
        video.load();
      } catch (e) {
        // Ignore video cleanup errors
      }
    });
  }
}
