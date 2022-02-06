/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import axios from '../../../utils/fetch';
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { createRef, FormEventHandler, useEffect, useState } from 'react';
import { app } from '../../../utils/db/webDB';
const ItemForm = dynamic(() => import('../ItemForm'));


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
    item: Item;
  }

const ItemDetail: NextPage<Props> = ({ item, categories }) => {
    const router = useRouter();
    const nameForm = createRef<HTMLInputElement>();
    const categoryForm = createRef<HTMLSelectElement>();
    const imageForm = createRef<HTMLInputElement>();
    const imageTag = createRef<HTMLImageElement>();
    const priceForm = createRef<HTMLInputElement>();
    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    useEffect(() => {
        const storage = getStorage(app);
        const reference = ref(storage, item.image);
        getDownloadURL(reference).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', url);
            xhr.send();
            imageTag.current?.setAttribute('src', url);
        });
    }, [imageTag, item.image]);

    const handleDelete = async () => {
        const proceed = confirm('Vas a borrar (' + item.nombre  + '). ¿Quieres continuar?');
        if (proceed) {
            const status = await axios.post('/api/delete', {id: item.id});
            if(status.status === 200 ) {
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
        const files = imageForm.current?.files;
        if (files === null) {
            console.log('Empty');
        } else {
            if(files === undefined){
                console.log('Empty');
            } else {
                body.append('image', files[0]);
            }
        }
        const status = await axios.post('/api/modify', body);
        //const status = await fetch('/api/modify', {method: 'POST', body});
        if (status.status === 200){ 
            setIsUploading(false);
            alert('Modificacion correcta');
            router.push('/dboard?ma', '', {scroll: false});
        } else {
            if((await axios.post('/api/modify', body)).status === 200){
                setIsUploading(false);
                alert('Modificacion correcta');
                router.push('/dboard?ma', '', {scroll: false});
            } else {
                setIsUploading(false);
                alert('Modificacion incorrecta');
            }
            
        }
        
    };
    return (
        <div className='flex flex-col'>
            <div className='grid grid-cols-4 p-10 mt-2 rounded-xl'>
                <img className=''
                    alt={item.nombre}
                    ref={imageTag}
                />
                <div className='col-span-3'>
                    <ItemForm 
                        onSubmit={modifyItem} 
                        isUploading={isUploading} 
                        nameForm={nameForm} 
                        categoryForm={categoryForm} 
                        categories={categories} 
                        imageForm={imageForm} 
                        isNameRequired={false} 
                        priceForm={priceForm}
                        defaultOption={item.categoria}
                    />
                </div>
            </div>
            <button onClick={handleDelete} className='mb-4 bg-red-600 shadow-lg shadow-red-600/50 p-2 rounded-2xl text-white font-bold text-2xl hover:-translate-y-1 transition-transform'>Borrar</button>
        </div>
    );
};



export default ItemDetail;
