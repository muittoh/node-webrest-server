import { Request, Response } from "express";

export class TodosController {

  //* DI
  constructor() { }

  public getTodos = (req: Request, res: Response) => {

    res.json([
      { id: 1, text: 'mensaje 1', createdAt: new Date() },
      { id: 2, text: 'mensaje 2', createdAt: new Date() },
      { id: 3, text: 'mensaje 3', createdAt: null },
    ]);
  }
}
