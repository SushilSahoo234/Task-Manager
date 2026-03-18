import express from "express";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);
export default router;