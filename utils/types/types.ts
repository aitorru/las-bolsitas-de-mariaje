type Item = {
    id?: string;
    categoria: string;
    nombre: string;
    image?: string;
    precio?: number;
};
type Category = {
    id: string;
    nombre: string;
};
export type {
    Item,
    Category
};