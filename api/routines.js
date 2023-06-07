const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineById,
} = require("../db/routines");
const { addActivityToRoutine } = require("../db/routine_activities");
const { requireUser } = require("./utils");

routinesRouter.use((req, res, next) => {
  console.log("A request has been made to /activities");

  next();
});

routinesRouter.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const creatorId = req.user.id;

  try {
    const newRoutine = await createRoutine({
      creatorId,
      isPublic,
      name,
      goal,
    });

    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const routine = await getRoutineById(routineId);
  const { name, goal, isPublic } = req.body;

  try {
    //todo
    if (req.user.id !== routine.creatorId) {
      res.status(403).send({
        error: "xyz",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: "xyz",
      });
    }
    if (req.user.id === routine.creatorId) {
      const updatedRoutine = await updateRoutine({
        id: routineId,
        name,
        goal,
        isPublic,
      });
      res.send(updatedRoutine);
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  let routine = await getRoutineById(req.params.routineId);
  try {
    if (req.user.id === routine.creatorId) {
      const deleteRoutine = await destroyRoutine(routineId);
      res.send(deleteRoutine);
    } else {
      next({
        message: "You must be the creator of this routine to delete it",
      });
    }
  } catch (error) {
    res.status(403).send(error);
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  if (!activityId || !count || !duration) {
    res.send({ message: "Missing fields" });
  }

  if (routineId === activityId) {
    res.send({ message: "Pair already exists" });
  }

  try {
    const newRoutineActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });
    res.send(newRoutineActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = routinesRouter;
