/* eslint-disable react/prop-types */
import axios from '../../utils/fetch';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { createRef, FormEventHandler, useState } from 'react';
import pride from '../../utils/pride';
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
    const priceForm = createRef<HTMLInputElement>();
    const textAreaForm = createRef<HTMLTextAreaElement>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    const uploadItem: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();

        setIsUploading(true);
        const body = new FormData();
        body.append('name', nameForm.current?.value.replace(/\s+/g, ' ').trim() || '');
        body.append('category', categoryForm.current?.value || '');
        body.append('price', priceForm.current?.value || '');
        body.append('descripcion', textAreaForm.current?.value || '');
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
        const end = Date.now() + (500);
        const colors = [
            Math.floor(Math.random()*16777215).toString(16), 
            Math.floor(Math.random()*16777215).toString(16)
        ];
        // Revalidate the category. The fallback will create the product page
        const status = await axios.post('/api/upload', body);
        axios.post('/api/revalidate', {route: `/c/${body.get('category')}`});
        if (status.status === 200){ 
            setIsUploading(false);
            pride(end, colors);
            router.push('/dboard');

        } else {
            if((await axios.post('/api/upload', body)).status === 200){
                setIsUploading(false);
                pride(end, colors);
                router.push('/dboard');
                return;
            }
            setIsUploading(false);
            alert('Subida incorrenta');
        }
    };
    return (
        <div className="container mx-auto flex flex-col justify-center content-center mt-5">
            <ItemForm
                descripcion=''
                onSubmit={uploadItem} 
                isUploading={isUploading} 
                nameForm={nameForm} 
                categoryForm={categoryForm} 
                categories={categories} 
                imageForm={imageForm} 
                isNameRequired={true} 
                priceForm={priceForm}
                textAreaForm={textAreaForm}
            />
        </div>
    );
};

export default UploadItem;
