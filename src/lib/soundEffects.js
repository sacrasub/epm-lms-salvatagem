// Web Audio API sintetizador de efeitos sonoros navais e táteis
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Alarme Geral SOLAS (7 toques curtos + 1 toque longo)
  playSolasAlarm() {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freq = 800;
    const shortDuration = 0.2;
    const gap = 0.15;

    // 7 curtos
    for (let i = 0; i < 7; i++) {
      const startTime = now + i * (shortDuration + gap);
      this.createBeep(freq, startTime, shortDuration);
    }

    // 1 longo
    const longStart = now + 7 * (shortDuration + gap) + 0.2;
    this.createBeep(freq, longStart, 1.2);
  }

  // Ping de Sonar Naval
  playSonarPing() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Tique-taque de contagem regressiva
  playTick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Acerto de resposta e XP
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Major (C5, E5, G5, C6)
    notes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + idx * 0.08;
      this.createBeep(freq, startTime, 0.2, 'triangle', 0.25);
    });
  }

  // Erro / Penalidade
  playBuzzer() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  createBeep(freq, start, duration, type = 'sine', volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }
}

export const soundManager = new SoundManager();
