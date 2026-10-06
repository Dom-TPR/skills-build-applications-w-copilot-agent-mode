import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.get('/api/users/', async (_request, response) => response.json(await User.find().lean()));
app.get('/api/teams/', async (_request, response) => response.json(await Team.find().populate('members').lean()));
app.get('/api/activities/', async (_request, response) => response.json(await Activity.find().populate('userId').lean()));
app.get('/api/leaderboard/', async (_request, response) => response.json(await Leaderboard.find().populate('userId teamId').lean()));
app.get('/api/workouts/', async (_request, response) => response.json(await Workout.find().lean()));

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`OctoFit API listening at ${baseUrl}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start OctoFit API:', error);
    process.exitCode = 1;
  });