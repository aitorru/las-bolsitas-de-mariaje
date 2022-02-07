import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createRef, useState } from 'react';
import Logo from '../../public/logo.png';

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const Header: NextPage<Props> = ({ categories }) => {
    const [ menuVisible, setMenuVisible ] = useState<boolean>(false);
    const dropDown = createRef<HTMLDivElement>();

    return (
        <div className="h-fit w-full py-2 shadow">
            <div className="container mx-auto flex flex-row justify-around h-full content-center items-center w-11/12 md:w-full">
                <Link passHref href={'/'}>
                    <Image
                        alt="Logo de la pagina"
                        src={Logo}
                        placeholder={'blur'}
                        height={120}
                        width={120}
                        className="cursor-pointer"
                    />
                </Link>

                <div className="hidden md:block">
                    <ul className="flex flex-row gap-3 content-center font-bold underline flex-wrap items-center justify-center lg:w-11/12 mx-auto">
                        {categories.map((category) => (
                            <li key={category.nombre}>
                                <Link
                                    passHref
                                    href={'/c/' + category.nombre}>
                                    <a className=''>{category.nombre}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link passHref href={'/contactar'}>
                    <a className="hidden md:block text-2xl md:text-4xl text-center font-bold h-full py-3 px-5 md:px-10 bg-blue-700 shadow-xl shadow-blue-700/50 rounded-xl text-white">
          Contactar
                    </a>
                </Link>
                
                <div className='md:hidden w-full flex justify-end relative text-left'>
                    <button 
                        className="text-2xl md:text-4xl text-center font-bold h-full py-3 px-5 md:px-10 bg-blue-700 shadow-xl shadow-blue-700/10 rounded-xl text-white" 
                        onClick={() => {
                            setMenuVisible(!menuVisible);
                            if (!menuVisible){
                                dropDown.current?.focus();
                            }
                        }}>
                        <Burger />
                    </button>
                    <div 
                        className="z-10 origin-top-right absolute right-0 top-20 mt-2 w-full mx-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                        role="menu" 
                        aria-orientation="vertical" 
                        aria-labelledby="menu-button" 
                        tabIndex={-1} 
                        style={!menuVisible ? {display: 'none'} : {}} 
                        onBlur={() => setMenuVisible(false)} 
                        ref={dropDown}>
                        <div className="py-1 w-full" role="none">
                            {categories.map((category) => (
                                <Link
                                    key={category.nombre}
                                    passHref
                                    href={'/c/' + category.nombre}>
                                    <a className='text-gray-700 block px-4 py-2 underline text-lg font-semibold' onClick={() => setMenuVisible(false)}>{category.nombre}</a>
                                </Link>
                            ))}
                            <Link passHref href={'/contactar'}>
                                <a className='bg-blue-700 shadow-xl shadow-blue-700/10 rounded-xl text-white block w-[90%] mx-auto text-center p-1 text-lg font-semibold mb-2'>Contactar</a>
                            </Link>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

const Burger: NextPage = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>;
};

export default Header;
