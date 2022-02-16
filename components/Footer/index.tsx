import type { NextPage } from 'next';

const Footer: NextPage = () => {
    return (
        <div className='p-6 grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-3 justify-center w-full bg-slate-700 items-center'>
            <div className='flex flex-row gap-5 max-h-11 justify-center'>
                <a target='_blank' href='https://www.facebook.com/LasBolsitasDeMariaje/' rel="noreferrer">
                    <FaceBookIcon />
                </a>
                <a target='_blank' href='https://wa.me/34697820927/?text=Hola!' rel="noreferrer">
                    <PhoneIcon />
                </a>
            </div>
            <h1 className='text-center text-xl text-white'>Hecho con ♥️ por <a className='underline' href='https://github.com/aitorru'>Aitor Ruiz Garcia</a></h1>
        </div>
    );
};

const FaceBookIcon = () => {
    return <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='h-11'>
        <path d="M 5 3 C 3.897 3 3 3.897 3 5 L 3 19 C 3 20.103 3.897 21 5 21 L 11.621094 21 L 14.414062 21 L 19 21 C 20.103 21 21 20.103 21 19 L 21 5 C 21 3.897 20.103 3 19 3 L 5 3 z M 5 5 L 19 5 L 19.001953 19 L 14.414062 19 L 14.414062 15.035156 L 16.779297 15.035156 L 17.130859 12.310547 L 14.429688 12.310547 L 14.429688 10.574219 C 14.429687 9.7862188 14.649297 9.2539062 15.779297 9.2539062 L 17.207031 9.2539062 L 17.207031 6.8222656 C 16.512031 6.7512656 15.814234 6.71675 15.115234 6.71875 C 13.041234 6.71875 11.621094 7.9845938 11.621094 10.308594 L 11.621094 12.314453 L 9.2773438 12.314453 L 9.2773438 15.039062 L 11.621094 15.039062 L 11.621094 19 L 5 19 L 5 5 z"/>
    </svg>;
};
const PhoneIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-11" fill="none" viewBox="0 0 24 24" stroke="#ffffff">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>;
};

export default Footer;
