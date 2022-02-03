import '../styles/index.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
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
