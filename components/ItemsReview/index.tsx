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
                <h1 className="py-5 text-4xl font-bold text-center md:text-6xl text-ellipsis">
                    {title}
                </h1>
                <div className="w-11/12 mx-auto my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-10 md:w-full">
                    {items.map((item) => (
                        <Card 
                            key={item.id} 
                            nombre={item.nombre} 
                            image={item.imageUrl}
                            blur={item.blur}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItemsReview;
