import type { NextPage } from 'next';
import Image from 'next/image';
import Logo from '../../public/logo.png';

const Hero: NextPage = () => {
    return (
        <div className="md:h-full flex md:flex-grow mb-10 md:mb-0">
            <div className="md:h-full container mx-auto grid grid-flow-col md:grid-flow-row grid-cols-1 md:grid-cols-2 md:grid-rows-1 items-center content-center my-auto gap-5">
                <div className='mt-5 md:mt-0'>
                    <h1 className="text-6xl md:text-7xl font-bold flex-auto self-center justify-items-center text-center w-11/12 mx-auto md:w-full md:mx-0">
            Las Bolsitas de Mariaje
                    </h1>
                    <h2 className="text-2xl md:text-3xl mt-6 text-center w-11/12 mx-auto md:w-full md:mx-0">
            Bolsas artesanales de tela con calidad y buen gusto: Gorros
            higiénicos o sanitarios, diademas turbante, coleteros, bolsos,
            bolsas de costado, mochilas, delantales, bolsas de pan, bolsitas
            infantiles…
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
        </div>
    );
};

export default Hero;
