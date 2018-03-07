import { Schema } from 'mongoose';
import options from './_options';
import { assignVirtuals } from './_utils';

const { ObjectId } = Schema.Types;

const Player = Schema({
    /*
     * Player Name (names cannot be duplicated)
     */
    username: {
      type: String,
      required: [true, 'Name is required'],
      index: { unique: true },
      unique: true,
      trim: true,
    },

    /*
     * Handedness (paddle hand)
     */
    hand: {
      type: String,
      enum: ['right', 'left', 'ambi'],
      required: [true, 'Hand must one of: right, left, ambi'],
    },
}, options);

/* Update validation */
Player.pre('findOneAndUpdate', function(next) {
  this.setOptions({
    runValidators: true
  });
  // const { hand } = this.getUpdate();
  // console.log(Player.paths.hand.enumValidator('right'));
  next();
});


/* Define virtual properties and getters */
// assignVirtuals(Player, {
//   winCount () { return this.wins.length },
//   lossCount () { return this.losses.length },
//   totalPlayed () { return this.winCount + this.lossCount },
// });

export default Player;
