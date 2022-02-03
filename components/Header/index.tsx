import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/logo.png';

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const Header: NextPage<Props> = ({ categories }) => {
    return (
        <div className="h-fit w-full py-2 shadow">
            <div className="container md:mx-auto flex flex-row justify-around h-full content-center items-center">
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
                    <ul className="flex flex-row gap-3 content-center font-bold underline flex-wrap items-center justify-center">
                        {categories.map((category) => (
                            <Link
                                key={category.nombre}
                                passHref
                                href={'/c/' + category.nombre}>
                                <a>{category.nombre}</a>
                            </Link>
                        ))}
                    </ul>
                </div>
                <a className="text-4xl text-center font-bold h-full py-3 px-10 bg-blue-700 shadow-xl shadow-blue-700/10 rounded-xl text-white">
          Comprar
                </a>
            </div>
        </div>
    );
};

export default Header;
