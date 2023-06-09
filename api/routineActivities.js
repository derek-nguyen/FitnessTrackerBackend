const express = require("express");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");
const routine_activitiesRouter = express.Router();

routine_activitiesRouter.use((req, res, next) => {
  console.log("A request has been made to /routine_activities");

  next();
});

routine_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const { routineId } = routineActivity;

    try {
      const routine = await getRoutineById(routineId);
      if (req.user.id === routine.creatorId) {
        const updatedRoutineActivity = await updateRoutineActivity({
          id: routineActivityId,
          count,
          duration,
        });
        console.log(updatedRoutineActivity);
        res.send(updatedRoutineActivity);
      } else {
        res.send({
          error: 'Cannot update routine with activity',
          message: `User ${req.user.username} is not allowed to update In the evening`,
          name: 'Update error'
        })
      }
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
);

routine_activitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    try {
      const routine = await getRoutineById(routineActivity.routineId);
      if (req.user.id === routine.creatorId) {
        const deletedRoutineActivity = await destroyRoutineActivity(
          routineActivityId
        );
        res.send(deletedRoutineActivity);
      } else {
        res.status(403).send({
          error: 'Cannot delete',
          message: `User ${req.user.username} is not allowed to delete In the afternoon`,
          name: 'Unauthorized'
        })
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routine_activitiesRouter;
