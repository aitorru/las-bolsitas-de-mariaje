import '../styles/index.css';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NextNprogress
                color="rgb(238, 153, 59)"
                startPosition={0.9}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
                options={{ easing: 'ease', speed: 500 }}
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
