
export class CreateTodoDto {

  private constructor(
    public readonly text: string,
  ) { }

  static from(props: { [key: string]: any }): [string | undefined, CreateTodoDto | undefined] {
    const { text } = props;
    if (!text) return ["la propiedad 'text' es obligatoria", undefined];

    return [undefined, new CreateTodoDto(text)];
  }
}