type Item = {
    id:            string;
    categoria:     string;
    descripcion:   string;
    nombre:        string;
    image:         string;
    imageUrl?:     string;
    precio:        string;
    blur:          string;
};
type Category = {
    id:     string;
    nombre: string;
};
type Highlight = {
    id:     string;
    refID:  string;
    pos:    number;
};
type Carousel = {
    id:     string;
    image:  string;
    blur:   string;
    pos:    number;
}
export type {
    Item,
    Category,
    Highlight,
    Carousel
};