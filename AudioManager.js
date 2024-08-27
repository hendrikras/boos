export default class AudioManager {
  constructor() {
    this.audio = {};
    this.isMuted = JSON.parse(localStorage.getItem('isMuted')) || false;
  }

  setAudioElement(name, url) {
    const audioElement = document.createElement("audio");
    document.body.appendChild(audioElement);
    audioElement.setAttribute("src", url);
    this.audio[name] = audioElement;
  }

  preload() {
    this.setAudioElement("shield", "shield.mp3");
    this.setAudioElement("snowStep", "snow-step.mp3");
    this.setAudioElement("move", "move.mp3");
    this.setAudioElement("menuChange", "menu-change.mp3");
  }

  play(name) {
    if (this.isMuted) return;
    if (this.audio[name]) {
      if (!this.audio[name].paused) {
        this.audio[name].pause();
        this.audio[name].currentTime = 0;
      }
      this.audio[name].play().catch((error) => {
        console.log(`Audio ${name} play failed:`, error);
      });
    } else {
      console.log(`Audio ${name} not found`);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('isMuted', JSON.stringify(this.isMuted));
    Object.values(this.audio).forEach(audio => {
      audio.muted = this.isMuted;
      if (this.isMuted) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}