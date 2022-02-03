import '../styles/index.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NextNprogress
                color="rgb(238, 153, 59)"
                startPosition={0.5}
                stopDelayMs={600}
                height={5}
                showOnShallow={true}
                options={{ easing: 'ease', speed: 100, showSpinner: false }}
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
