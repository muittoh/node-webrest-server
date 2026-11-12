import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";

const todos = [
  { id: 1, text: 'mensaje 1', completedAt: new Date() },
  { id: 2, text: 'mensaje 2', completedAt: new Date() },
  { id: 3, text: 'mensaje 3', completedAt: null },
];

export class TodosController {

  //* DI
  constructor() { }

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    res.json(todos);
    return;
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    (todo)
      ? res.json(todo)
      : res.json({ error: `TODO con ID ${id} no encontrado` })
  }

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.from(req.body ?? {});
    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });

    res.json(todo);
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    if (!todo) {
      res.status(404).json({ error: `TODO con ID ${id} no encontrado` });
      return;
    }

    const { text, completedAt } = req.body;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        text,
        completedAt: (completedAt) ? new Date(completedAt) : null
      }
    });

    res.json(updatedTodo);
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = await prisma.todo.findUnique({
      where: { id }
    });
    if (!todo) {
      res.status(404).json({ error: `TODO con ID ${id} no encontrado` });
      return;
    }

    const deleted = await prisma.todo.delete({
      where: { id }
    });

    (deleted)
      ? res.json(deleted)
      : res.status(400).json({ error: `TODO con ID ${id} no encontrado` })
  }
}
