import { extendObservable, action } from 'mobx';

class Player {
  constructor(id, title) {
    this.id = id;
    this.title = title;

    extendObservable(this, {
      score: 0,

      incrementScore: action(() => this.score += 1),

      decrementScore: action(() => {
        if (this.score > 0) {
          return this.score -= 1
        }
      }),
    });
  }
}

export default Player;
