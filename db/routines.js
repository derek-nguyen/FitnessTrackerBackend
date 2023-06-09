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
//todo i think my refactor doesnt pass other test
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: publicRoutinesActivity } = await client.query(
      `
    select
      u.username as "creatorName" 
    , r.*
    from routines r
    join users u on u.id = r."creatorId"
    join routine_activities on r.id = routine_activities."routineId"
    where r."isPublic" = true
    and routine_activities."activityId" = $1;
    `,
      [id]
    );

    const activityPublicRoutines = await attachActivitiesToRoutines(
      publicRoutinesActivity
    );

    // const filteredActivityPublicRoutines = activityPublicRoutines.filter(
    //   (obj) => {
    //     return obj.activities.some((activity) => {
    //       return activity.id === id;
    //     });
    //   }
    // );
    // console.log("this is fapr", filteredActivityPublicRoutines);
    return activityPublicRoutines;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const {
        rows: [updatedRoutine],
      } = await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id = $${Object.keys(fields).length + 1}
        RETURNING *;
      `,
        [...Object.values(fields), id]
      );

      // console.log("Updated Routine", updatedRoutine);
      return updatedRoutine;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function destroyRoutine(id) {
  // removes routine from database
  // deletes all the routine_activities whose routine is the one being deleted

  try {
    await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = $1;
    `,
      [id]
    );
    // console.log(deletedRoutineActivities);

    await client.query(
      `
          DELETE FROM routines
          WHERE id = $1;
        `,
      [id]
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}

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
