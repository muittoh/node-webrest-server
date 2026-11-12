
export class UpdateTodoDto {

  private constructor(
    public readonly id: number,
    public readonly text?: string,
    public readonly completedAt?: Date,
  ) { }

  get values(): { text?: string, completedAt?: Date } {
    const returnObj: { [key: string]: any } = {};

    if (this.text) returnObj.text = this.text;
    if (this.completedAt !== undefined) returnObj.completedAt = this.completedAt;

    return returnObj;
  }

  static from(props: { [key: string]: any }): [string | undefined, UpdateTodoDto | undefined] {
    const { id, text, completedAt } = props;
    let newCompletedAt = completedAt;

    if (!id || isNaN(Number(id))) {
      return ["el campo 'id' debe ser un numero", undefined];
    }

    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (newCompletedAt.toString() === 'Invalid Date') {
        return ["el campo'completedAt' debe ser una fecha válida", undefined];
      }
    }

    return [undefined, new UpdateTodoDto(id, text, newCompletedAt)];
  }
}