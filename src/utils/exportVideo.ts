import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

interface ExportVideoOptions {
  element: HTMLElement;
  filename?: string;
  durationSeconds?: number;
  fps?: number;
  onProgress?: (progress: number, status: string) => void;
}

/**
 * Exports an HTML/SVG element containing animation to a genuine MP4 video file
 * using WebCodecs VideoEncoder + mp4-muxer, with MediaRecorder fallback.
 */
export async function exportAnimationToMp4({
  element,
  filename = 'yourmap-animated.mp4',
  durationSeconds = 3,
  fps = 30,
  onProgress,
}: ExportVideoOptions): Promise<void> {
  const totalFrames = Math.round(durationSeconds * fps);
  const frameIntervalMs = 1000 / fps;

  // Determine export dimensions (even numbers required by H.264 codecs)
  const rect = element.getBoundingClientRect();
  let width = Math.round(rect.width * 1.5);
  let height = Math.round(rect.height * 1.5);

  // Ensure width and height are even numbers (H.264 requirement)
  if (width % 2 !== 0) width += 1;
  if (height % 2 !== 0) height += 1;

  // Target standard 16:9 or bounded dimensions for stability
  if (width > 1920) {
    const scale = 1920 / width;
    width = 1920;
    height = Math.round(height * scale);
    if (height % 2 !== 0) height += 1;
  }

  onProgress?.(5, 'Initializing video encoder...');

  // Check if WebCodecs VideoEncoder is available
  const hasWebCodecs = typeof window !== 'undefined' && typeof (window as any).VideoEncoder === 'function';

  if (hasWebCodecs) {
    try {
      await encodeWithWebCodecs({
        element,
        width,
        height,
        fps,
        totalFrames,
        frameIntervalMs,
        filename,
        onProgress,
      });
      return;
    } catch (err) {
      console.warn('WebCodecs encoding error, falling back to MediaRecorder:', err);
    }
  }

  // Fallback: Real-time MediaRecorder
  await encodeWithMediaRecorder({
    element,
    width,
    height,
    durationSeconds,
    fps,
    filename,
    onProgress,
  });
}

/**
 * WebCodecs + mp4-muxer high-fidelity frame-by-frame encoding
 */
async function encodeWithWebCodecs({
  element,
  width,
  height,
  fps,
  totalFrames,
  frameIntervalMs,
  filename,
  onProgress,
}: {
  element: HTMLElement;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  frameIntervalMs: number;
  filename: string;
  onProgress?: (progress: number, status: string) => void;
}) {
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width,
      height,
      frameRate: fps,
    },
    fastStart: 'in-memory',
  });

  const videoEncoder = new (window as any).VideoEncoder({
    output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
    error: (e: any) => console.error('VideoEncoder error:', e),
  });

  // H.264 Baseline Profile Level 3.1 or 4.0
  await videoEncoder.configure({
    codec: 'avc1.42001f',
    width,
    height,
    bitrate: 5_000_000, // 5 Mbps high quality
  });

  // Hidden capture canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get canvas 2d context');

  for (let i = 0; i < totalFrames; i++) {
    const progress = Math.round(10 + (i / totalFrames) * 75);
    onProgress?.(progress, `Rendering frame ${i + 1} of ${totalFrames}...`);

    // Capture current frame from element
    const frameCanvas = await htmlToImage.toCanvas(element, {
      canvasWidth: width,
      canvasHeight: height,
      skipFonts: true,
      cacheBust: false,
      pixelRatio: 1,
    });

    ctx.drawImage(frameCanvas, 0, 0, width, height);

    // Microsecond timestamp
    const timestampUs = Math.round((i * 1_000_000) / fps);
    const videoFrame = new (window as any).VideoFrame(canvas, {
      timestamp: timestampUs,
      duration: Math.round(1_000_000 / fps),
    });

    const isKeyframe = i % 30 === 0;
    videoEncoder.encode(videoFrame, { keyFrame: isKeyframe });
    videoFrame.close();

    // Yield execution briefly so UI updates
    await new Promise(r => setTimeout(r, Math.max(5, frameIntervalMs / 4)));
  }

  onProgress?.(90, 'Finalizing MP4 video...');
  await videoEncoder.flush();
  muxer.finalize();

  const buffer = muxer.target.buffer;
  const blob = new Blob([buffer], { type: 'video/mp4' });

  onProgress?.(100, 'Download starting!');
  saveAs(blob, filename);
}

/**
 * MediaRecorder Fallback (records canvas stream for the duration)
 */
async function encodeWithMediaRecorder({
  element,
  width,
  height,
  durationSeconds,
  fps,
  filename,
  onProgress,
}: {
  element: HTMLElement;
  width: number;
  height: number;
  durationSeconds: number;
  fps: number;
  filename: string;
  onProgress?: (progress: number, status: string) => void;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2d context not available');

  const stream = canvas.captureStream(fps);
  const mimeType = (window as any).MediaRecorder?.isTypeSupported('video/mp4; codecs=avc1')
    ? 'video/mp4; codecs=avc1'
    : (window as any).MediaRecorder?.isTypeSupported('video/mp4')
    ? 'video/mp4'
    : 'video/webm';

  const recorder = new (window as any).MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e: any) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>(resolve => {
    recorder.onstop = () => {
      const recordedBlob = new Blob(chunks, { type: 'video/mp4' });
      resolve(recordedBlob);
    };
  });

  recorder.start();

  const startTime = Date.now();
  const totalMs = durationSeconds * 1000;

  // Render loop
  const interval = setInterval(async () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(95, Math.round(10 + (elapsed / totalMs) * 80));
    onProgress?.(progress, `Recording animation... ${Math.round((elapsed / 1000) * 10) / 10}s`);

    try {
      const frameCanvas = await htmlToImage.toCanvas(element, {
        canvasWidth: width,
        canvasHeight: height,
        skipFonts: true,
        pixelRatio: 1,
      });
      ctx.drawImage(frameCanvas, 0, 0, width, height);
    } catch (e) {
      // Continue
    }

    if (elapsed >= totalMs) {
      clearInterval(interval);
      recorder.stop();
    }
  }, 1000 / fps);

  const videoBlob = await recordingPromise;
  onProgress?.(100, 'Saving MP4 video...');
  saveAs(videoBlob, filename);
}
