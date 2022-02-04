import dynamic from 'next/dynamic';
import Head from 'next/head';
import { NextPage } from 'next/types';
import { createRef, FormEventHandler, useState } from 'react';
const FirePlace = dynamic(() => import('../components/Fireplace/index'));
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Fire: NextPage = () => {
    const nameTag = createRef<HTMLInputElement>();
    const passwordTag = createRef<HTMLInputElement>();
    const [ isLogginIn, setLogginIn ] = useState<boolean>(false);

    const router = useRouter();

    const loginUser: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();

        setLogginIn(true);

        const body = {
            username: nameTag.current?.value,
            password: passwordTag.current?.value,
        };
        const status = await fetch('/api/login', {
            body: JSON.stringify(body),
            method: 'POST',
        });
        const result = await status.json();
        if (result.success && result.token) {
            Cookies.set('token', result.token, { expires: 31556926 });
            Cookies.set('username', result.username, { expires: 31556926 });
            setLogginIn(false);
            router.push('/dboard');
        } else {
            setLogginIn(false);
        }
    };
    return (
        <div className="container mx-auto flex flex-col justify-center content-center min-h-screen h-full align-middle">
            <Head>
                <title>Fire handle</title>
            </Head>
            <FirePlace />
            <form
                onSubmit={loginUser}
                className="flex flex-col justify-center content-center w-11/12 md:w-9/12 mx-auto gap-3">
                <label htmlFor="name" className="text-center text-3xl">
          Nombre
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="username"
                    required
                    className="border-orange-600 shadow-lg shadow-orange-600/50 border-2 p-2 px-5 rounded-xl text-xl"
                    ref={nameTag}
                />
                <label htmlFor="name" className="text-center text-3xl">
          Contraseña
                </label>
                <input
                    id="name"
                    name="name"
                    type="password"
                    autoComplete="name"
                    required
                    className="border-orange-600 shadow-lg shadow-orange-600/50 border-2 p-2 px-5 rounded-xl text-xl"
                    ref={passwordTag}
                />
                <button
                    type="submit"
                    className="bg-orange-600 shadow-xl shadow-orange-600/10 rounded-xl text-white p-2 font-semibold text-2xl flex justify-center items-center gap-5">
          Login{isLogginIn && <FireIcon />}
                </button>
            </form>
        </div>
    );
};

const FireIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>;
};

export default Fire;
