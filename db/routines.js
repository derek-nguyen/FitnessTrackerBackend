const client = require("./client");

const { attachActivitiesToRoutines } = require("./activities")

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

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT *
      FROM routines 
      WHERE id = $1
    `, [id]);

    return routine;
  } catch (err) {
    console.error('Unable to get routine by id', err)
    throw err;
  }

}

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
    , r.*
    from routines r
    join users u on u.id = r."creatorId";
    `);

    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    return routinesWithActivities;

  } catch (err) {
    console.error(err);
    throw err
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
    `)

    const publicRoutinesWithActivities = await attachActivitiesToRoutines(publicRoutines);
    return publicRoutinesWithActivities

  } catch (err) {
    console.error(err);
    throw err
  }

}

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
