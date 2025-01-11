import mongoose from 'mongoose';
import config from './config';
import User from './modules/User';
import { randomUUID } from 'node:crypto';
import Task from './modules/Task';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;
  try {
    await db.dropCollection('users');
    await db.dropCollection('tasks');
  } catch (err) {
    console.error(err);
  }

  const [beka, daler] = await User.create(
    {
      username: 'Beka',
      password: '123',
      token: randomUUID(),
    },
    {
      username: 'daler',
      password: '321',
      token: randomUUID(),
    },
  );
  await Task.create(
    {
      user: beka,
      title: 'homework',
      description: 'Mongoose task',
      status: 'new',
    },
    {
      user: daler,
      title: 'build',
      description: 'build the house',
      status: 'new',
    },
  );
  await db.close();
};

run().catch((err) => {
  console.error(err);
});
