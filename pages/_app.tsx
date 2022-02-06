import '../styles/index.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
import Head from 'next/head';
import Logo from '../public/logo.png';

function MyApp({ Component, pageProps }: AppProps) {
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
            </Head>
            <NextNprogress
                color="rgb(238, 153, 59)"
                startPosition={0.7}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
                options={{ easing: 'ease', speed: 1000, showSpinner: false, trickleSpeed: 800 }}
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
