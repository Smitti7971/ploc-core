// Robust procedural popping sound using a globally-unlocked Web Audio API Context
let sharedAudioCtx: AudioContext | null = null;

if (typeof window !== 'undefined') {
  const enableAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass && !sharedAudioCtx) {
        sharedAudioCtx = new AudioContextClass();
        sharedAudioCtx.resume().catch(() => { });
      }
    } catch (e) {
      // Silent catch
    }
    window.removeEventListener('pointerdown', enableAudio, true);
    window.removeEventListener('keydown', enableAudio, true);
  };
  window.addEventListener('pointerdown', enableAudio, true);
  window.addEventListener('keydown', enableAudio, true);
}

export const playPlocSound = () => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    const ctx = sharedAudioCtx;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }

    if (ctx.state !== 'running') {
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    const jitter = 0.9 + Math.random() * 0.2; // between 90% and 110%
    const soundType = Math.floor(Math.random() * 3);

    if (soundType === 0) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(780 * jitter, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(10 * jitter, now + 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.14);
    } else if (soundType === 1) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(340 * jitter, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(20 * jitter, now + 0.15);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      osc.start(now);
      osc.stop(now + 0.16);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(1150 * jitter, now + 0.03);
      osc.frequency.exponentialRampToValueAtTime(80 * jitter, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    setTimeout(() => {
      osc.disconnect();
      gain.disconnect();
    }, 250);
  } catch (e) {
    // Silent catch
  }
};
