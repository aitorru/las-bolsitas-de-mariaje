/* eslint-disable react/prop-types */
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { createRef, useEffect, useState } from 'react';
//import ItemDetail from './ItemDetail';
const ItemDetail = dynamic(() => import('./ItemDetail'));

type Item = {
    id: string;
    categoria: string;
    nombre: string;
    image: string;
};
type Categories = {
    nombre: string;
  };

interface Props {
    categories: Categories[];
    items: Item[];
}

const ModifyItem: NextPage<Props> = ({ items, categories }) => {
    return (
        <div className='container mx-auto flex flex-col gap-5 my-5'>
            {
                items.map(item => <DetailElement key={item.id} item={item} categories={categories} />
                )
            }
        </div>
    );
};

interface SecondaryProps {
    categories: Categories[];
    item: Item;
}

const DetailElement: NextPage<SecondaryProps> = ({item, categories}) => {
    const detailElement = createRef<HTMLDetailsElement>();
    const [isOpenned, setIsOpenned] = useState<boolean>(false);
    useEffect(() => {
        detailElement.current?.addEventListener('toggle', (e) => {
            if(detailElement.current?.open) {
                setIsOpenned(true);
            } else {
                setIsOpenned(false);
            }
        });
    }, [detailElement]);
    
    return (
        <details key={item.id} ref={detailElement} className='border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl cursor-pointer'>
            <summary className='list-none font-bold grid grid-cols-2 text-ellipsis overflow-hidden select-none'>
                <h1 className=''>{item.nombre}</h1>
                <h1 className='text-right'>{item.categoria}</h1>
            </summary>
            {isOpenned && <ItemDetail categories={categories} item={item} /> }
        </details>
    );
};

export default ModifyItem;
