import { Request, Response } from "express";

const todos = [
  { id: 1, text: 'mensaje 1', createdAt: new Date() },
  { id: 2, text: 'mensaje 2', createdAt: new Date() },
  { id: 3, text: 'mensaje 3', createdAt: null },
];

export class TodosController {

  //* DI
  constructor() { }

  public getTodos = (req: Request, res: Response) => {
    res.json(todos);
    return;
  }

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = todos.find(todo => todo.id === id);

    (todo)
      ? res.json(todo)
      : res.json({ error: `TODO con ID ${id} no encontrado` })
  }
}
