"use client";

import { NextPage } from 'next';
import { createRef, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModifyCategoryForm from './CategoryForm/ModifyCategoryForm';
import pride from '../../utils/pride';
import { modifyCategoryAction } from '../../app/dboard/actions';

type Categories = {
    id: string;
    nombre: string;
};

type Item = {
    id: string;
    categoria: string;
    nombre: string;
    image: string;
};

interface Props {
    categories: Categories[];
    items : Item[];
}

const ModifyCategory: NextPage<Props> = ({categories, items}) => {
    const router = useRouter();
    const [isUploading, setisUploading] = useState(false);
    const categoryNameRef = createRef<HTMLInputElement>();
    const categoryOriginRef = createRef<HTMLSelectElement>();

    const handleCategoryChange: 
    FormEventHandler<HTMLFormElement> = async (event) => {
        // meh
        event.preventDefault();

        let detector = false;
        let id = '';

        // Check if rules apply
        for (const i in items) {
            if(items[i].categoria ===  categoryOriginRef.current?.value){
                detector = true;
            }
        }
        for (const i in categories) {
            if(categories[i].nombre === categoryOriginRef.current?.value){
                id = categories[i].id;
            }
        }
        if (detector) {
            alert('La categoria no esta vacia');
            return;
        }

        setisUploading(true);
        const end = Date.now() + (500);
        const colors = [
            Math.floor(Math.random()*16777215).toString(16), 
            Math.floor(Math.random()*16777215).toString(16)
        ];
        
        const result = await modifyCategoryAction(
            id,
            categoryNameRef.current?.value || ''
        );
        if (result.status === 200) {
            setisUploading(false);
            pride(end, colors);
            router.push('/dboard?mc');
            
        }
    };

    return <ModifyCategoryForm 
        onSubmit={handleCategoryChange} 
        nameForm={categoryNameRef} 
        categories={categories} 
        categoryForm={categoryOriginRef} 
        isUploading={isUploading}  />;
};

export default ModifyCategory;
