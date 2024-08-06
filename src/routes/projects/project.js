import express from "express";
import dbConnector from "../../util/dbConnector.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// get projects

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { projects } = await dbConnector(["projects"]);
    const foundItem = await projects.findOne({ _id: new ObjectId(id) });
    return res.status(200).json(foundItem);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { projects } = await dbConnector(["projects"]);

    if (req.body["dueDate"] && !Date.parse(req.body["dueDate"])) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    //check the project exists
    const existingProject = await projects.findOne({ _id: new ObjectId(id) });
    if (!existingProject) {
      return res.status(404).send("Project not found");
    }

    const changes = {
      date: {
        start: existingProject["date"]["start"],
        due: existingProject["date"]["due"],
      },
    };

    // Loop over the body and if the existing task info isn't the same already, add it to the changes object.
    Object.keys(req.body).forEach((key) => {
      if (existingProject[key] !== req.body[key]) {
        if (key === "dueDate") {
          changes.date["due"] = new Date(req.body[key]);
        } else if (key === "name") {
          changes[key] = req.body[key];
        }
      }
    });

    // If the new status is "To do" update startDate and doneDate
    if (changes.status === "To do") {
      changes.date.start = new Date();
      changes.date.done = null;
    } // complete done Date if done
    if (changes.status === "Done") {
      changes.date.done = new Date();
    }

    const updatedProject = await projects.updateOne(
      { _id: new ObjectId(id) },
      { $set: changes },
    );
    return res.status(200).json(updatedProject);
  } catch (e) {
    next(e);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const id = req.body["id"];
    const { projects, tasks } = await dbConnector(["projects", "tasks"]);
    const deletedTasks = await tasks.deleteMany({
      projectID: new ObjectId(id),
    });
    const deletedProject = await projects.findOneAndDelete({
      _id: new ObjectId(id),
    });
    return res.status(200).json({ deletedTasks, deletedProject });
  } catch (e) {
    next(e);
  }
});

export default router;
