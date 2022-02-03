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
                className="rounded-xl"
                alt={item.nombre}
                ref={imageTag}
            />
            <div className='flex flex-col gap-10 justify-center'>
                <h1 className='text-center text-6xl text-ellipsis font-bold'>{item.nombre}</h1>
                <a href={'https://wa.me/34697820927/?text=Hola! Estoy interesado/a en ' + item.nombre + '. ' + href} target="_blank" className='text-4xl text-white px-10 py-5 bg-lime-500 rounded-2xl text-center font-bold' rel="noreferrer">Contantar</a>
            </div>
        </div>
    );
};

export default FullItem;