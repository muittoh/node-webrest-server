
export class TodoEntity {

  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) { }

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromObject(object: { [key: string]: any }): TodoEntity {
    const { id, text, completedAt } = object;
    if (!id) throw "El campo 'id' es obligatorio";
    if (!text) throw "El campo 'text' es obligatorio";

    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);

      if (isNaN(newCompletedAt.getTime())) {
        throw "'completedAt' debe ser una fecha válida";
      }
    }

    return new TodoEntity(id, text, completedAt);
  }
}