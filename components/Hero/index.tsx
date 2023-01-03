import type { NextPage } from 'next';
import Image from 'next/legacy/image';
import Logo from '../../public/logo.png';

const Hero: NextPage = () => {
    return (
        <div className="md:h-full flex md:flex-grow mb-10 md:mb-0 flex-col">
            <div className="md:h-full container mx-auto grid grid-flow-col md:grid-flow-row grid-cols-1 md:grid-cols-2 md:grid-rows-1 items-center content-center my-auto gap-5">
                <div className='mt-1 md:mt-0'>
                    <div className="flex md:hidden justify-center mx-auto w-3/5">
                        <Image
                            alt="Logo de la pagina"
                            src={Logo}
                            layout={'intrinsic'}
                            placeholder={'blur'}

                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold flex-auto self-center justify-items-center text-center w-11/12  mx-auto md:w-full md:mx-0">
                        Las Bolsitas de Mariaje
                    </h1>
                    <h2 className='text-lg md:text-xl lg:text-3xl mt-6 text-center w-11/12 mb-3 md:mb-0 mx-auto md:w-full md:mx-0 font-semibold'>
                        Bolsas artesanales de tela con calidad y buen gusto
                    </h2>
                    <h2 className="hidden md:block text-lg md:text-xl lg:text-2xl mt-6 text-center w-11/12 mb-10 md:mb-0 mx-auto md:w-full md:mx-0">
                    Bolsitas de tela, mochilas, bolsos, bolsas de costado, 
                    bolsas para bebes personalizadas, bolsas de pan,
                    fundas para robot de cocina, delantales, gorro de cocinero,
                    fundas de gafas, soportes para movil,
                    complementos, diadema turbante, coleteros,
                    buf y mucho más... 
                    </h2>
                </div>
                <div className="hidden md:flex md:justify-center md:skew-y-3">
                    <Image
                        alt="Logo de la pagina"
                        src={Logo}
                        layout={'intrinsic'}
                        placeholder={'blur'}
                    />
                </div>
            </div>
            <a 
                href='#destacados' 
                className='hidden lg:flex w-fit mx-auto mb-20 justify-center bg-blue-700 shadow-2xl shadow-blue-700/50 text-white px-10 p-3 rounded-2xl text-3xl font-semibold items-center gap-5 hover:scale-105 transition-transform'>
                Ver nuestra tienda <Arrow />
            </a>
        </div>
    );
};

const Arrow = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.8rem] w-[1.8rem] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
    </svg>;
};

export default Hero;
