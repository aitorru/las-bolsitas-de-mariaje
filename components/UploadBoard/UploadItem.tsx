/* eslint-disable react/prop-types */
import axios from '../../utils/fetch';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { createRef, FormEventHandler, useState } from 'react';
const ItemForm = dynamic(() => import('./ItemForm'));

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const UploadItem: NextPage<Props> = ({ categories }) => {
    const router = useRouter();
    const nameForm = createRef<HTMLInputElement>();
    const categoryForm = createRef<HTMLSelectElement>();
    const imageForm = createRef<HTMLInputElement>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    const uploadItem: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();

        setIsUploading(true);
        const body = new FormData();
        body.append('name', nameForm.current?.value || '');
        body.append('category', categoryForm.current?.value || '');
        const files = imageForm.current?.files;
        if (files === null) {
            alert('La imagen esta vacia');
            return;
        } else {
            if(files === undefined){
                alert('La imagen esta vacia');
                return;
            } else {
                body.append('image', files[0]);
            }
        }
        const status = await axios.post('/api/upload', body);
        if (status.status === 200){ 
            setIsUploading(false);
            alert('Subida correcta');
            router.push('/dboard');

        } else {
            setIsUploading(false);
            alert('Subida incorrenta');
        }
    };
    return (
        <div className="container mx-auto flex flex-col justify-center content-center mt-5">
            <ItemForm onSubmit={uploadItem} isUploading={isUploading} nameForm={nameForm} categoryForm={categoryForm} categories={categories} imageForm={imageForm} isNameRequired={true} />
        </div>
    );
};

export default UploadItem;
