import { NextPage } from 'next';
import { createRef, FormEventHandler, useState } from 'react';
import axios from '../../utils/fetch';
import { useRouter } from 'next/router';
import ModifyCategoryForm from './CategoryForm/ModifyCategoryForm';
import DeleteCategoryForm from './CategoryForm/DeleteCategoryForm';

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

const DeleteCategory: NextPage<Props> = ({categories, items}) => {
    const router = useRouter();
    const [isUploading, setisUploading] = useState(false);
    const categoryOriginRef = createRef<HTMLSelectElement>();

    const handleCategoryChange: FormEventHandler<HTMLFormElement> = async (event) => {
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
        categories.forEach(category => axios.post('/api/revalidate', {route: `/c/${category.nombre}`}));
        axios.post('/api/revalidate', {route: '/'});
        const status = await axios.post('/api/category/delete',{ id: id });
        if (status.status === 200) {
            router.prefetch('/dboard?bc');
            setisUploading(false);
            alert('Eliminacion de categoria correcta');
            router.push('/dboard?bc');
            
        }
    };

    return <DeleteCategoryForm onSubmit={handleCategoryChange} categories={categories} categoryForm={categoryOriginRef} isUploading={isUploading}  />;
};

export default DeleteCategory;
