import Wereld from './Wereld.js';
import Splash from './Splash.js';
import Dimensie from './Dimensie.js';
import StopWatch from './StopWatch.js';
import { GET_API, LIVES, POST_API, VERSION } from './constants.js';

function sortScore(PlayerName, Score, highscore) {
  const newScore = { PlayerName, Score };
  const compare = highscore.slice();
  const index = compare.findIndex(item => item.Score < Score);
  if (index === -1) {
    compare.push(newScore);
  } else {
    compare.splice(index, 0, newScore);
  }
  compare.sort((a, b) => b.Score - a.Score);
  return compare.slice(0, 10);
}

export default class extends StopWatch {
  constructor(p5) {
    super();
    this.dim = new Dimensie(10, 10);
    this.wereld = new Wereld(this.dim, this, p5);
    this.splash = new Splash(this.wereld, this, p5);
    this.p5 = p5;
    this.end = true;
    this.highscore = [
      { PlayerName: 'Peter', Score: 1000 },
      { PlayerName: 'Mike', Score: 900 },
      { PlayerName: 'John', Score: 800 },
      { PlayerName: 'Jane', Score: 700 },
      { PlayerName: 'Sue', Score: 600 },
      { PlayerName: 'Bill', Score: 500 },
      { PlayerName: 'Kate', Score: 400 },
      { PlayerName: 'Alex', Score: 300 },
      { PlayerName: 'Anna', Score: 200 },
      { PlayerName: 'Rebecca', Score: 100 }
    ];
    this.yourScore = null;
    this.totalTime = null;

    fetch(GET_API)
      .then(response => {
        return response.text();
      })
      .then(data => {
        this.highscore = JSON.parse(data)
          .map(item => ({ PlayerName: item.PlayerName.S.split(',')[0], Score: item.Score.N }))
          .sort((a, b) => b.Score - a.Score);
      })
      .catch(error => console.error(error));
    this.progress = [];
  }

  moveHighscore(playerName, lastTimes, score, levelStats, totalTime, highscore, setHighscore) {
    function doFetch(name) {
      const scoreInput = {
        version: VERSION,
        levelStats,
        totalTime,
        lastTimes,
        score,
        playerName: name,
      }
      fetch(POST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreInput)
      })
        .then(response => {
          setHighscore(sortScore(name, score, highscore));
          return response.text();
        })
        .catch(error => console.error(error));
      }
    const lowestScore = this.highscore.at(-1).Score;
    if (score < lowestScore) {
      this.yourScore = score === 0 ? 1 : score;
    } else {
      if (!playerName) {
        this.splash.active = true;
        this.splash.isMain = false;
        this.splash.callback = doFetch;
      } else {
        doFetch(playerName);
      }
    }
    this.progress = [];
  }
  moveLeft() {
    this.splash.moveLeft();
    this.wereld.verplaatsMens(-1, 0);
  }
  moveRight() {
    if (this.splash.active) {
      this.splash.moveRight();
    } else {
      this.wereld.verplaatsMens(1, 0);
    }
  }
  moveDown() {
    if (this.splash.active) {
      this.splash.moveDown();
    } else {
      this.wereld.verplaatsMens(0, 1);
    }

  }
  moveUp() {
    this.splash.moveUp();
    this.wereld.verplaatsMens(0, -1);
  }
  confirm() {
    this.splash.confirm();
  }
  update() {
    if (!this.end) {
      this.wereld.paint(this.p5);
    }

  }

  startApp() {
    if (this.splash.active) {
      this.splash.paint();
      this.wereld.pause = true;
    } else {
      if (!this.startTime) {
        this.startTime = new Date();
      }
      this.wereld.pause = false;
      this.wereld.start(this.p5);
    }
  }

  pauseApp() {
    this.wereld.pause = true;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static calculateLevel({ time, level }, accumulator = 0) {
    const multiplier = 10000 / time;
    return accumulator + Math.round(level * 100 * multiplier);
  }

  goMain(lostLevels) {
    this.totalTime = this.stopTimer();
    this.startTime = new Date();
    this.end = true;
    this.splash.isScore = true;

    const score = this.progress.reduce((accumulator, stage) => this.constructor.calculateLevel(stage, accumulator), 0);
    const timeAlive = lostLevels.reduce((accumulator, value) => accumulator + value, 0);
    const livesLeft = LIVES - lostLevels.length;
    let livesBonus = 0
    for (let i = 0; i < livesLeft; i++) {
      const lastLevel = this.progress.at(-1).level;
      livesBonus += this.constructor.calculateLevel({ time: (this.totalTime - timeAlive) / lastLevel, level: lastLevel + i });
    }

    this.moveHighscore(this.capitalizeFirstLetter(this.splash.playerName), lostLevels, score + livesBonus, this.progress, this.totalTime, this.highscore, (score) => this.highscore = score);
    this.startGam();
  }

  startGam() {
    this.wereld.start();
  }

  getDim() {
    return this.dim;
  }
}
