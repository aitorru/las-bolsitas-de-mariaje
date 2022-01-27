import type { NextPage } from "next";
import Card from "./Card";

type Item = {
  nombre: string;
  image: string;
};
interface Props {
  items: Item[];
}

const ItemsReview: NextPage<Props> = ({ items }) => {
  return (
    <div className="min-h-screen">
      <div className="container md:mx-auto">
        <h1 className="text-6xl font-bold text-center py-5">
          Mira nuestra tienda
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-11/12 md:w-full mx-auto">
          {items.map((item) => (
            <Card key={item.image} nombre={item.nombre} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsReview;
