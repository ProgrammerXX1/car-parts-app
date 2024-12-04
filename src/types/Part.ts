export interface Part {
  id: string;
  name: string;
  price: number;
  quantity: number;
  showChildren?: boolean; // Добавляем свойство showChildren
  children?: Part[];
}
