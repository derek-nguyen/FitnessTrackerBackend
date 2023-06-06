const express = require("express");
const activitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
  getActivityByName,
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
    const updatedActivity = await updateActivity({ id, name, description });
    if (updatedActivity) {
      res.send(updatedActivity);
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

//todo need to refactor getPublicRoutinesByActivity
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const activities = await getPublicRoutinesByActivity({ activityId });

    if (activities) {
      res.send(activities);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
