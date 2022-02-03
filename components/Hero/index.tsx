import type { NextPage } from 'next';
import Image from 'next/image';
import Logo from '../../public/logo.png';

const Hero: NextPage = () => {
    return (
        <div className="h-full flex flex-grow bg-cover bg-center" style={{}}>
            <div className="h-full container mx-auto grid grid-flow-col md:grid-flow-row grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 items-center content-center my-auto gap-5">
                <div>
                    <h1 className="text-7xl font-bold flex-auto self-center justify-items-center text-center md:text-left w-11/12 mx-auto md:w-full md:mx-0">
            Las Bolsitas de Mariaje
                    </h1>
                    <h2 className="text-3xl mt-6 text-center md:text-left w-11/12 mx-auto md:w-full md:mx-0">
            Bolsas artesanales de tela con calidad y buen gusto: Gorros
            higiénicos o sanitarios, diademas turbante, coleteros, bolsos,
            bolsas de costado, mochilas, delantales, bolsas de pan, bolsitas
            infantiles…
                    </h2>
                </div>
                <div className="md:skew-y-3">
                    <Image
                        alt="Puesto en un mercadillo"
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
