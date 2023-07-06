import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import { Category } from '../utils/types/types';
import Image from 'next/image';
import QR from '../public/qr-code.png';
import { useEffect, useState } from 'react';
interface Props {
    categories: Category[];
}

const Product: NextPage<Props> = ({categories}) => {

    const [animate_qr, set_animate_qr] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {set_animate_qr(true);}, 500);
    }, []);

    return (
        <div className='min-h-screen max-h-screen flex flex-col'>
            <Head>
                <title>Contacto</title>
            </Head>
            <Header categories={categories} />
            <div className={`container flex flex-row gap-7 max-w-fit mx-auto my-auto justify-around ${animate_qr ? '' : 'translate-x-60'} transition-all duration-1000`}>
                <div className=' flex flex-col gap-7 transition'>
                    <h1 className='text-4xl md:text-6xl text-center font-semibold'>¿Quieres contactar conmigo?</h1>
                    <h2 className='text-3xl md:text-5xl text-center text-ellipsis'>Por correo electrónico</h2>
                    <a 
                        href={'mailto:lasbolsitasdemariaje@gmail.com?subject=Contacto&body=' +  encodeURIComponent('Hola Mariaje,')}
                        className='w-[98%] md:w-full mx-auto text-lg md:text-4xl text-white px-10 py-3 mb-5 md:mb-0 bg-blue-700 shadow-xl shadow-blue-700/50 rounded-2xl text-center font-bold flex flex-row justify-center items-center hover:-translate-y-2 transition-transform'>
                    lasbolsitasdemariaje@gmail.com<Mail />
                    </a>
                    <h2 className='text-3xl  md:text-5xl text-center text-ellipsis'>o por whatsapp</h2>
                    <a 
                        href={'https://wa.me/34697820927/?text=' + encodeURIComponent('Hola Mariaje,')}
                        target="_blank" 
                        className='w-[98%] md:w-full mx-auto text-xl md:text-4xl text-white px-10 py-3 mb-5 md:mb-0 bg-blue-700 shadow-xl shadow-blue-700/50 rounded-2xl text-center font-bold flex flex-row justify-center items-center hover:-translate-y-2 transition-transform' 
                        rel="noreferrer">
                        697 820 927<Phone />
                    </a>
                </div>
                <Image alt="Código QR para contactar" className={`hidden lg:block ${animate_qr ? 'scale-100' : 'scale-0 hidden'} transition ease-in-out duration-1000 relative object-scale-down w-1/4`} src={QR} />
            </div>
        </div>
    );
};

const Phone = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="w-[1.5rem] h-[1.5rem] md:h-[2.5rem] md:w-[2.5rem] ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>;
};
const Mail = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="md:h-[2.7rem] md:w-[2.7rem] ml-2 hidden md:block" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>;
  
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            categories: await getCategories(),
        },
        revalidate: 3600, // In seconds
    };
};

async function getCategories(): Promise<Category[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'categorias');
    const snapshot = await getDocs(itemsColletion);
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
        categories.push({
            id: doc.id,
            nombre: doc.data().nombre,
        });
    });
    return categories;
}

export default Product;

