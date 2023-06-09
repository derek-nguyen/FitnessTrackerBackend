const express = require("express");
const activitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
  getActivityByName,
  getActivityById,
} = require("../db");

activitiesRouter.use((req, res, next) => {
  console.log("A request has been made to /activities");

  next();
});

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();

    if (activities) {
      res.send(activities);
    }
  } catch (error) {
    next(error);
  }
});

activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  const activityData = { name, description };

  try {
    const _activity = await getActivityByName(name);
    if (_activity) {
      next({
        name: "xyz",
        message: `An activity with name ${name} already exists`,
        error: "xyz",
      });
    }
    const activityPost = await createActivity(activityData);
    // console.log(activityPost);

    res.send(activityPost);
  } catch (error) {
    next(error);
  }
});

//todo probably want to use requireUser middleware later
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  const id = req.params.activityId;
  const { name, description } = req.body;

  try {
    const _activity = await getActivityById(id);

    if (!_activity || _activity.id === id) {
      next({
        name: "Error",
        message: `Activity ${id} not found`,
        error: "xyz",
      });
    }

    // if (!_activity) {
    //   next({
    //     name: "xyz",
    //     message: `Activity ${id} not found`,
    //     error: "xyz",
    //   });
    // }

    const updatedActivity = await updateActivity({ id, name, description });

    res.send(updatedActivity);
  } catch (error) {
    if (error.code === "23505") {
      next({
        name: "Error",
        message: `An activity with name ${name} already exists`,
        error: "xyz",
      });
    } else {
      next(error);
    }
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  if (!(await getActivityById(activityId))) {
    next({
      name: "Error",
      message: `Activity ${activityId} not found`,
      error: "xyz",
    });
  }

  console.log("activityid", activityId);

  try {
    const activities = await getPublicRoutinesByActivity({ id: activityId });

    res.send(activities);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
