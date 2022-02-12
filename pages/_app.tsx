import '../styles/index.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
import Head from 'next/head';
import Logo from '../public/logo.png';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';

function MyApp({ Component, pageProps }: AppProps) {
    const [passTheVisiblePoint, setPassTheVisiblePoint] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if(window.scrollY > window.screen.availHeight / 2.3) {
                setPassTheVisiblePoint(true);
            } else {
                setPassTheVisiblePoint(false);
            }
        });
    }, []);
    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <meta name="description" content='Bolsas artesanales de tela con calidad y buen gusto: Bolsitas de tela, mochilas, bolsos, bolsas de costado, 
                bolsas para bebes personalizadas, bolsas de pan, fundas para robot de cocina, delantales, gorro de cocinero, 
                gorro higiénico, fundas de gafas, soportes para movil, complementos, diadema turbante, coleteros,
                buf y mucho más...'>
                </meta>
                <meta name="keywords" content="Bolsas, Tela, Mochilas, Bolsos, Bolsas de costado, Gorros, Diademas, Coleteros"></meta>
                <meta name="author" content="Aitor Ruiz Garcia"></meta>
                <meta property='og:image' content={Logo.src}></meta>
                <link rel="icon" type="image/png" href={Logo.src}></link>
            </Head>
            <NextNprogress
                color="rgb(238, 153, 59)"
                startPosition={0.7}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
                options={{ easing: 'ease', speed: 1000, showSpinner: false, trickleSpeed: 800 }}
            />
            <div className='h-0 sticky origin-right top-[90vh] z-10 overflow-x-clip flex justify-end'>
                <BackToTop visible={passTheVisiblePoint} />
            </div>
            <Component {...pageProps} />
        </>
    );
}

const BackToTop: NextPage<{visible: boolean}> = ({ visible }) => {

    return (
        <button 
            className={`sticky h-min z-20 right-6 p-2 rounded-xl bg-blue-700  shadow-blue-700/50 text-white transition-all duration-700 hover:scale-110 ${visible ? 'shadow-xl' : 'scale-0 hover:scale-0'}`}
            onClick={() => {
                window.scrollTo({top: 0});
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[2rem] w-[2rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
            </svg>
        </button>
    );
};

export default MyApp;
