const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const { rows: [routinesAndActivities] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [routineId, activityId, count, duration]);

  // console.log(routinesAndActivities)
  return routinesAndActivities;
}

async function getRoutineActivityById(id) {

  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id = $1;
    `, [id]);

    // console.log(routineActivity)
    return routineActivity;
  } catch (err) {
    console.log(err);
    throw err;

  }

}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivities } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1;
    `, [id]);

    // console.log(routineActivities)
    return routineActivities;
  } catch (err) {
    console.log(err);
    throw err;
  }

}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map((key, index) => `"${key}" = $${index + 1}`).join(', ');

  try {
    if (setString.length > 0) {
      const { rows: [routineActivity] } = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id = $${Object.values(fields).length + 1}
        RETURNING *;
      `, [...Object.values(fields), id]);

      return routineActivity;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }

}


async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
    `, [id]);

    return routineActivity;
  } catch (err) {
    console.log(err);
    throw err;
  }

}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT *
      FROM routine_activities ra
      JOIN routines r ON r.id = ra."routineId"
      WHERE ra.id = $1;
    `, [routineActivityId]);

    // console.log("routineActivity to check for user: ", routineActivity)
    // console.log("user id to test", userId)

    if (routineActivity.creatorId === userId) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
