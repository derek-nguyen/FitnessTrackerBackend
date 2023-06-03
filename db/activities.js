const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities (name, description)
      VALUES ($1,$2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,
      [name, description]
    );
    // return the new activity
    return activity;
  } catch (err) {
    console.error("Error creating activity");
    throw err;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: allActivities } = await client.query(`
      SELECT *
      FROM activities;
    `);

    return allActivities;
  } catch (err) {
    console.error("Error getting all activities");
    throw err;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id = $1;
    `,
      [id]
    );

    return activity;
  } catch (err) {
    console.error("Error getting activity by id");
    throw err;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE name = $1;
    `,
      [name]
    );

    return activity;
  } catch (err) {
    console.error("Error getting activity by name");
    throw err;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  const { rows: routine_activities } = await client.query(`
    select *
    from routine_activities ra 
    join activities a on ra."activityId" = a.id;
  `);

  routines.map(routine => {
    routine.activities = []
    routine_activities.map(activity => {
      let activityData = {
        description: activity.description,
        id: activity.id,
        name: activity.name,
        duration: activity.duration,
        count: activity.count,
        routineId: activity.routineId,
        routineActivityId: activity.activityId
      }

      if (activity.routineId === routine.id) {
        routine.activities.push(activityData)
      }
    })

  })
  
  return routines;
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    // do update the name and description
    // return the updated activity
    if (setString.length > 0) {
      const {
        rows: [updatedActivity],
      } = await client.query(
        `
        UPDATE activities 
        SET ${setString}
        WHERE id = $${Object.keys(fields).length + 1}
        RETURNING *;
      `,
        [...Object.values(fields), id]
      );
      return updatedActivity;
    }
  } catch (err) {
    console.error("Error updating activity");
    throw err;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
