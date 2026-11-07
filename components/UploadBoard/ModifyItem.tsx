/* eslint-disable react/prop-types */
"use client";
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { createRef, useEffect, useState } from 'react';
import { Category, Item } from '../../utils/types/types';
//import ItemDetail from './ItemDetail';
const ItemDetail = dynamic(() => import('./ItemDetail'));

interface Props {
    categories: Category[];
    items: Item[];
}

const ModifyItem: NextPage<Props> = ({ items, categories }) => {
    return (
        <div className='container mx-auto flex flex-col gap-5 my-5'>
            {
                items.map(
                    item => <DetailElement 
                        key={item.id} 
                        item={item} 
                        categories={categories} 
                    />
                )
            }
        </div>
    );
};

interface SecondaryProps {
    categories: Category[];
    item: Item;
}

const DetailElement: NextPage<SecondaryProps> = ({item, categories}) => {
    const detailElement = createRef<HTMLDetailsElement>();
    const [isOpenned, setIsOpenned] = useState<boolean>(false);
    useEffect(() => {
        detailElement.current?.addEventListener('toggle', () => {
            if(detailElement.current?.open) {
                setIsOpenned(true);
            } else {
                setIsOpenned(false);
            }
        });
    }, [detailElement]);
    
    return (
        <details id={item.id} key={item.id} ref={detailElement} className='lb-admin-row'>
            <summary 
                className='lb-admin-row__head'
            >
                <h1 className=''>{item.categoria}</h1>
                <h1 className='text-right'>{`${item.nombre} (${item.precio} €)`}</h1>
            </summary>
            {isOpenned && <ItemDetail categories={categories} item={item} /> }
        </details>
    );
};

export default ModifyItem;
