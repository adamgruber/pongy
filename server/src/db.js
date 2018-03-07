import mongoose from 'mongoose';

const connectToDb = async ({ host, db }) => {
  try {
    await mongoose.connect(`mongodb://${host}/${db}`);
    console.log(`Connected to ${host}/${db}`);
  } catch (err) {
    console.error(err);
  }
};

export default connectToDb;
