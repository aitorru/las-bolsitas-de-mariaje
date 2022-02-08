import type { NextPage } from 'next';
import { Item } from '../../utils/types/types';
import Card from './Card';
interface Props {
    title: string;
    items: Item[];
}

const ItemsReview: NextPage<Props> = ({ items, title }) => {
    return (
        <div className="min-h-screen">
            <div className="container md:mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-center py-5 text-ellipsis">
                    {title}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-32 w-11/12 md:w-full mx-auto my-10">
                    {items.map((item) => (
                        <Card 
                            key={item.image} 
                            nombre={item.nombre} 
                            image={item.image}
                            blur={item.blur}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemsReview;
