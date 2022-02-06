import { NextPage } from 'next';
import { createRef, FormEventHandler, useState } from 'react';
import axios from '../../utils/fetch';
import { useRouter } from 'next/router';
import ModifyCategoryForm from './CategoryForm/ModifyCategoryForm';

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
            console.log(categories[i].nombre, categoryOriginRef.current?.value, categories[i].nombre === categoryOriginRef.current?.value);
            if(categories[i].nombre === categoryOriginRef.current?.value){
                id = categories[i].id;
            }
        }
        if (detector) {
            alert('La categoria no esta vacia');
            return;
        }

        setisUploading(true);
        const status = await axios.post('/api/category/modify',{ origin: id, destination: categoryNameRef.current?.value });
        if (status.status === 200) {
            router.prefetch('/dboard?mc');
            setisUploading(false);
            alert('Modificacion de categoria correcta');
            router.push('/dboard?mc');
            
        }
    };

    return <ModifyCategoryForm onSubmit={handleCategoryChange} nameForm={categoryNameRef} categories={categories} categoryForm={categoryOriginRef} isUploading={isUploading}  />;
};

export default ModifyCategory;