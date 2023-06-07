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

//todo put back requireUser middleware later
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  // const creatorId = req.user.id;

  try {
    const newRoutine = await createRoutine({
      // creatorId,
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
    throw error;
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const deletedRoutine = await destroyRoutine(routineId);
    res.send(deletedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  if (!activityId || !count || !duration) {
    res.send({ message: "Missing fields" });
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
