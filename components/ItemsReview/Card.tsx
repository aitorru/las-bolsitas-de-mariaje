/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { createRef, useEffect, useState } from 'react';
import { app } from '../../utils/db/webDB';
import Link from 'next/link';

interface Props {
  nombre: string;
  image: string;
}

const Card: NextPage<Props> = ({ nombre, image }) => {
    const imageTag = createRef<HTMLImageElement>();
    const [isImageLoaded, setImageLoaded] = useState<boolean>(false);
    useEffect(() => {
        const storage = getStorage(app);
        const reference = ref(storage, image);
        getDownloadURL(reference).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', url);
            xhr.send();
            imageTag.current?.setAttribute('src', url);
            setImageLoaded(true);
        });
    }, [image, imageTag]);
    return (
        <div className="flex flex-col p-5 border-2 mx-auto border-blue-700 rounded-xl shadow-xl shadow-blue-700/50 h-full min-h-fit min-w-full">
            <img
                className="rounded-xl"
                alt={nombre}
                ref={imageTag}
                style={isImageLoaded ? { minHeight: '8rem' } : { display: 'none' }}
            />
            <h1 className="text-3xl w-4/5 mx-auto text-center my-3 font-bold">
                {nombre}
            </h1>
            <Link passHref href={'/p/' + nombre}>
                <a className="py-3 w-4/5 mx-auto text-center font-semibold mt-auto bg-blue-700 shadow-2xl shadow-blue-700/10 rounded-xl text-white hover:-translate-y-1 transition-transform">
          Comprar
                </a>
            </Link>
        </div>
    );
};

export default Card;
