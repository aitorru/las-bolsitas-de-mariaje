import dynamic from 'next/dynamic';
import Head from 'next/head';
import { NextPage } from 'next/types';
import { createRef, FormEventHandler } from 'react';
const FirePlace = dynamic(() => import('../components/Fireplace/index'));
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Fire: NextPage = () => {
    const nameTag = createRef<HTMLInputElement>();
    const passwordTag = createRef<HTMLInputElement>();

    const router = useRouter();

    const loginUser: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();
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
            router.push('/dboard');
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
                    autoComplete="name"
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
                    className="bg-orange-600 shadow-xl shadow-orange-600/10 rounded-xl text-white p-2 font-semibold text-2xl">
          Login
                </button>
            </form>
        </div>
    );
};

export default Fire;
