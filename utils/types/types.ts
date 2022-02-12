type Item = {
    id: string;
    categoria: string;
    descripcion: string;
    nombre: string;
    image: string;
    precio: string;
    blur: string;
};
type Category = {
    id: string;
    nombre: string;
};
type Highlight = {
    id: string;
    refID: string;
    pos: number;
};
export type {
    Item,
    Category,
    Highlight,
};