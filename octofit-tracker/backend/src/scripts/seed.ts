import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();
    const userSeeds = [
      { name: 'Alex Morgan', email: 'alex.morgan@octofit.local', grade: 10 },
      { name: 'Jordan Lee', email: 'jordan.lee@octofit.local', grade: 11 },
      { name: 'Sam Rivera', email: 'sam.rivera@octofit.local', grade: 9 },
    ];
    const users = await Promise.all(
      userSeeds.map(async (seed) => {
        const existing = await User.findOne({ email: seed.email });
        return existing ?? User.create(seed);
      }),
    );

    const teamSeeds = [
      { name: 'Trailblazers', description: 'Building endurance together', members: [users[0]._id, users[1]._id] },
      { name: 'Strength Squad', description: 'Small steps, strong habits', members: [users[2]._id] },
    ];
    const teams = await Promise.all(
      teamSeeds.map(async (seed) => {
        const existing = await Team.findOne({ name: seed.name });
        if (existing) return existing;
        return Team.create(seed);
      }),
    );

    const activitySeeds = [
      { userId: users[0]._id, type: 'running', durationMinutes: 25, distanceKm: 3.2, points: 32, loggedAt: new Date('2026-09-01T15:00:00.000Z') },
      { userId: users[1]._id, type: 'walking', durationMinutes: 40, distanceKm: 2.6, points: 26, loggedAt: new Date('2026-09-02T15:00:00.000Z') },
      { userId: users[2]._id, type: 'strength-training', durationMinutes: 35, points: 35, loggedAt: new Date('2026-09-03T15:00:00.000Z') },
    ];
    await Promise.all(
      activitySeeds.map(async (seed) => {
        const existing = await Activity.findOne({ userId: seed.userId, loggedAt: seed.loggedAt });
        if (!existing) await Activity.create(seed);
      }),
    );

    const leaderboardSeeds = [
      { userId: users[0]._id, teamId: teams[0]._id, period: 'weekly', points: 120, rank: 1 },
      { userId: users[1]._id, teamId: teams[0]._id, period: 'weekly', points: 95, rank: 2 },
      { userId: users[2]._id, teamId: teams[1]._id, period: 'weekly', points: 80, rank: 3 },
    ];
    await Promise.all(
      leaderboardSeeds.map(async (seed) => {
        const existing = await Leaderboard.findOne({ userId: seed.userId, period: seed.period });
        if (!existing) await Leaderboard.create(seed);
      }),
    );

    const workoutSeeds = [
      {
        name: 'Easy Start',
        description: 'A gentle full-body routine for building a movement habit.',
        level: 'beginner',
        exercises: [
          { name: 'March in place', durationMinutes: 3 },
          { name: 'Bodyweight squats', sets: 2, reps: 8 },
        ],
      },
      {
        name: 'Run and Recover',
        description: 'Short running intervals with walking recovery.',
        level: 'intermediate',
        exercises: [
          { name: 'Easy jog', durationMinutes: 4 },
          { name: 'Walk recovery', durationMinutes: 2 },
        ],
      },
      {
        name: 'Core Builder',
        description: 'A focused bodyweight core session.',
        level: 'beginner',
        exercises: [
          { name: 'Bird dog', sets: 2, reps: 8 },
          { name: 'Front plank', sets: 2, durationMinutes: 1 },
        ],
      },
    ];
    await Promise.all(
      workoutSeeds.map(async (seed) => {
        const existing = await Workout.findOne({ name: seed.name });
        if (!existing) await Workout.create(seed);
      }),
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
