/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  nombre: string;
  image: string;
  blur: string;
}

const Card: NextPage<Props> = ({ nombre, image, blur }) => {

    return (
        <div className="flex flex-col h-full min-w-full p-5 mx-auto border-2 border-blue-700 shadow-xl rounded-xl shadow-blue-700/50 min-h-fit">
            <div>
                <div className='relative h-[20rem]'>
                    <Link passHref href={'/p/' + nombre}>
                        <a>
                            <Image
                                className="rounded-xl"
                                alt={nombre}
                                src={image}
                                placeholder='blur'
                                blurDataURL={blur}
                                layout={'fill'} 
                                objectFit={'contain'}
                            />
                        </a>
                    </Link>
                </div>
            </div>
            <h1 className="w-4/5 mx-auto my-3 text-3xl font-bold text-center">
                {nombre}
            </h1>
            <Link passHref href={'/p/' + nombre}>
                <a className="flex flex-row justify-center w-4/5 py-3 mx-auto mt-auto font-semibold text-center text-white bg-blue-700 shadow-2xl shadow-blue-700/10 rounded-xl hover:scale-105 transition-transform">
                Más información<Plus />
                </a>
            </Link>
        </div>
    );
};

const Plus = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>;
};

export default Card;
