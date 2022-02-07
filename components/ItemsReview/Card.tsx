/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { createRef, useEffect, useState } from 'react';
import { app } from '../../utils/db/webDB';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  nombre: string;
  image: string;
}

const Card: NextPage<Props> = ({ nombre, image }) => {

    return (
        <div className="flex flex-col p-5 border-2 mx-auto border-blue-700 rounded-xl shadow-xl shadow-blue-700/50 h-full min-h-fit min-w-full">
            <div>
                <div className='relative h-[20rem]'>
                    <Image
                        className="rounded-xl"
                        alt={nombre}
                        src={image}
                        layout={'fill'} 
                        objectFit={'contain'}
                    />
                </div>
            </div>
            <h1 className="text-3xl w-4/5 mx-auto text-center my-3 font-bold">
                {nombre}
            </h1>
            <Link passHref href={'/p/' + nombre}>
                <a className="flex flex-row justify-center py-3 w-4/5 mx-auto text-center font-semibold mt-auto bg-blue-700 shadow-2xl shadow-blue-700/10 rounded-xl text-white hover:-translate-y-1 transition-transform">
                Más información<Plus />
                </a>
            </Link>
        </div>
    );
};

const Plus = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>;
};

export default Card;
