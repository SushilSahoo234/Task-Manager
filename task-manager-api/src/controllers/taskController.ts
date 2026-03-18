import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getTasks = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, search = "", status } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        title: {
          contains: search as string,
          mode: "insensitive",
        },
        completed:
          status !== undefined ? status === "completed" : undefined,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    const task = await prisma.task.create({
      data: { title, userId },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  const updated = await prisma.task.update({
    where: { id },
    data: { title },
  });

  res.json(updated);
};

export const toggleTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};