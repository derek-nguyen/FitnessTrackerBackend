const client = require("./client");

const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (e) {
    console.error(e);
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routines 
      WHERE id = $1
    `,
      [id]
    );

    return routine;
  } catch (err) {
    console.error("Unable to get routine by id", err);
    throw err;
  }
}

async function getRoutinesWithoutActivities() {
  // TEST: Will temporarily return all routines

  console.log("Calling getRoutinesWithoutActivities");
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM routines;
    `);

    return routines;
  } catch (err) {
    console.error(err);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId";
    `);

    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    return routinesWithActivities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId"
    where r."isPublic" = true;
    `);

    const publicRoutinesWithActivities = await attachActivitiesToRoutines(
      publicRoutines
    );
    return publicRoutinesWithActivities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: userRoutines } = await client.query(
      `
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId"
    where u.username = $1;
    `,
      [username]
    );

    const userRoutinesWithActivities = await attachActivitiesToRoutines(
      userRoutines
    );
    return userRoutinesWithActivities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: userPublicRoutines } = await client.query(
      `
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId"
    where u.username = $1 and r."isPublic" = true;
    `,
      [username]
    );

    const userPublicRoutinesWithActivities = await attachActivitiesToRoutines(
      userPublicRoutines
    );
    return userPublicRoutinesWithActivities;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: publicRoutinesActivity } = await client.query(`
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId"
    where r."isPublic" = true;
    `);

    const { rows: routine_activities } = await client.query(`
    SELECT * 
    FROM routine_activities;
`);

    publicRoutinesActivity.map((routine) => {
      routine.activities = [];

      routine_activities.map((activity) => {
        let workoutData = {
          id: activity.id,
          activityId: activity.activityId,
          count: activity.count,
          duration: activity.duration,
        };
        if (activity.routineId === routine.id) {
          if (activity.activityId === id);
          routine.activities.push(workoutData);
        }
      });
    });

    const activityPublicRoutines = await attachActivitiesToRoutines(
      publicRoutinesActivity
    );

    console.log("Activity Test ID", id);
    console.log(activityPublicRoutines[0]);

    return activityPublicRoutines;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
