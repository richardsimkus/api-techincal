import express from "express";
import dbConnector from "../../util/dbConnector.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { tasks } = await dbConnector(["tasks"]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const data = [
    {
      $lookup: {
        from: "projects",
        localField: "projectID",
        foreignField: "_id",
        as: "project",
      },
    },
    {
      $unwind: "$project",
    },
    {
      $match: {
        "project.date.due": {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        status: 1,
        "date.start": 1,
        "date.due": 1,
        "date.done": 1,
        "project.name": 1,
        "project.date.due": 1,
      },
    },
  ];
  try {
    const result = await tasks.aggregate(data).toArray();
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
