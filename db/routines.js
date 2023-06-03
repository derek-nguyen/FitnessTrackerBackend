const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    return routine;
  } catch (e) {
    console.error(e);
  }
}

async function getRoutineById(id) { }

async function getRoutinesWithoutActivities() {
  // TEST: Will temporarily return all routines

  console.log('Calling getRoutinesWithoutActivities')
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM routines;
    `);

    return routines;

  } catch (err) {
    console.error(err)
  }

}

async function getAllRoutines() {
  try {

    const { rows: routines } = await client.query(`
    select
      u.username as "creatorName" 
    , r.id 
    , r."creatorId"
    , r."isPublic"
    , r.name
    , r.goal
    , ra."routineId"
    , ra."activityId"
    , a.*
    from routines r
    join users u on u.id = r."creatorId" 
    join routine_activities ra on ra."routineId" = r.id
    join activities a on a.id = ra."activityId"

    `);

    console.log(routines)
    return routines;

  } catch (err) {
    console.error(err);
  }

}

async function getAllPublicRoutines() { }

async function getAllRoutinesByUser({ username }) { }

async function getPublicRoutinesByUser({ username }) { }

async function getPublicRoutinesByActivity({ id }) { }

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

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
