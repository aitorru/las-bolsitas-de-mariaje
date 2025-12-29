/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
"use client";

import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createRef, FormEventHandler, useEffect, useState } from 'react';
import { app } from '../../../utils/db/webDB';
import { Category, Item } from '../../../utils/types/types';
import pride from '../../../utils/pride';
import { deleteItemAction, modifyItemAction } from '../../../app/dboard/actions';
const ItemForm = dynamic(() => import('../ItemForm'));

interface Props {
    categories: Category[];
    item: Item;
  }

const ItemDetail: NextPage<Props> = ({ item, categories }) => {
    const router = useRouter();
    const nameForm = createRef<HTMLInputElement>();
    const categoryForm = createRef<HTMLSelectElement>();
    const imageForm = createRef<HTMLInputElement>();
    const imageTag = createRef<HTMLImageElement>();
    const priceForm = createRef<HTMLInputElement>();
    const textAreaForm = createRef<HTMLTextAreaElement>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    useEffect(() => {
        if (item.imageUrl !== '') {
            imageTag.current?.setAttribute('src', item.imageUrl);
            return;
        }
        const storage = getStorage(app);
        const reference = ref(storage, item.image);
        getDownloadURL(reference).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', url);
            xhr.send();
            imageTag.current?.setAttribute('src', url);
        });
    }, [imageTag, item.image, item.imageUrl]);

    const handleDelete = async () => {
        const proceed = confirm('Vas a borrar (' + item.nombre  + '). ¿Quieres continuar?');
        if (proceed) {
            const result = await deleteItemAction(item.id);
            if(result.status === 200 ) {
                router.push('/dboard?ma');
            }
        } else {
            //don't proceed
        }
    };

    const modifyItem: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();

        setIsUploading(true);
        const body = new FormData();
        body.append('id', item.id);
        body.append('price', priceForm.current?.value || '');
        body.append('name', nameForm.current?.value || '');
        body.append('category', categoryForm.current?.value || '');
        body.append('descripcion', textAreaForm.current?.value || '');
        const files = imageForm.current?.files;
        if (files === null) {
            //
        } else {
            if(files === undefined){
                //
            } else {
                body.append('image', files[0]);
            }
        }
        const result = await modifyItemAction(body);
        const end = Date.now() + (500);
        const colors = [
            Math.floor(Math.random()*16777215).toString(16), 
            Math.floor(Math.random()*16777215).toString(16)
        ];
        //const status = await fetch('/api/modify', {method: 'POST', body});
        if (result.status === 200){
            
            setIsUploading(false);
            pride(end, colors);
            router.push('/dboard?ma');
        } else {
            setIsUploading(false);
            alert('Modificacion incorrecta');
        }
        
    };
    return (
        <div className='flex flex-col'>
            <div className='items-center p-10 mt-2 grid grid-cols-4 rounded-xl'>
                <img className=''
                    alt={item.nombre}
                    ref={imageTag}
                />
                <div className='col-span-3'>
                    <ItemForm
                        descripcion={item.descripcion}
                        onSubmit={modifyItem} 
                        isUploading={isUploading} 
                        nameForm={nameForm} 
                        categoryForm={categoryForm} 
                        categories={categories} 
                        imageForm={imageForm} 
                        isNameRequired={false} 
                        priceForm={priceForm}
                        defaultOption={item.categoria}
                        textAreaForm={textAreaForm}
                    />
                </div>
            </div>
            <button onClick={handleDelete} className='p-2 mb-4 text-2xl font-bold text-white bg-red-600 shadow-lg shadow-red-600/50 rounded-2xl hover:-translate-y-1 transition-transform'>Borrar</button>
        </div>
    );
};



export default ItemDetail;
