/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../utils/db/webDB';
import { createRef, useEffect, useState } from 'react';

type Item = {
    nombre: string;
    image: string;
};
interface Props {
    item: Item;
}

const FullItem: NextPage<Props> = ({item}) => {
    const imageTag = createRef<HTMLImageElement>();
    const [href, setHref] = useState<string>('');
    useEffect(() => {
        setHref(window.location.toString());
    }, []);
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
    return (
        <div className='container mx-auto grid md:grid-cols-2 h-full flex-grow justify-center items-center'>
            <img
                className="rounded-xl shadow-2xl mx-auto w-11/12"
                alt={item.nombre}
                ref={imageTag}
            />
            <div className='flex flex-col gap-10 justify-center mx-auto w-11/12'>
                <h1 className='text-center text-5xl md:text-6xl text-ellipsis font-bold'>{item.nombre}</h1>
                <a 
                    href={'https://wa.me/34697820927/?text=Hola! Estoy interesado/a en ' + item.nombre + '. ' + href} 
                    target="_blank" 
                    className='text-4xl text-white px-10 py-3 bg-blue-700 shadow-2xl shadow-blue-700/50 rounded-2xl text-center font-bold flex flex-row justify-center items-center' 
                    rel="noreferrer">Contactar<Phone /></a>
            </div>
        </div>
    );
};

const Phone = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.5rem] w-[2.5rem] ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>;
};

export default FullItem;