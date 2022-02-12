/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from '../../utils/fetch';
import { NextPage } from 'next';
import { createRef, FormEventHandler, useEffect, useState } from 'react';
import { Item, Highlight } from '../../utils/types/types';
import { useRouter } from 'next/router';

interface Props {
    highlights: Highlight[];
    items : Item[];
}

const EditHighLight: NextPage<Props> = ({items, highlights}) => {

    const formRef = createRef<HTMLFormElement>();
    const [isUploading, setisUploading] = useState(false);
    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        //Fuck browsers
        e.preventDefault();
        setisUploading(true);

        // It must be always 6 items in the highlight
        // @ts-ignore
        const p1: HTMLSelectElement = e.target[0];
        // @ts-ignore
        const p2: HTMLSelectElement = e.target[1];
        // @ts-ignore
        const p3: HTMLSelectElement = e.target[2];
        // @ts-ignore
        const p4: HTMLSelectElement = e.target[3];
        // @ts-ignore
        const p5: HTMLSelectElement = e.target[4];
        // @ts-ignore
        const p6: HTMLSelectElement = e.target[5];

        console.log(p1.value, p2.value, p3.value, p4.value, p5.value, p6.value);

        const status = await axios.post('/api/highlight/modify', {
            p1: await findItemID(items, p1.value),
            p2: await findItemID(items, p2.value),
            p3: await findItemID(items, p3.value),
            p4: await findItemID(items, p4.value),
            p5: await findItemID(items, p5.value),
            p6: await findItemID(items, p6.value),
        });
        if (status.status === 200) {
            router.prefetch('/dboard?eh');
            alert('Modificacion correcta');
            router.push('/dboard?eh');
        } else {
            alert('Modificacion incorrecta');
        }

        // Convert to id

        setisUploading(false);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} className='flex flex-col justify-center w-3/4 mx-auto gap-5'>
            {
                highlights.map((hl) =>
                    <HighlightMapper key={hl.id} hl={hl} items={items} />
                
                )
            }
            <button
                type="submit"
                className=" bg-blue-600 shadow-xl shadow-blue-600/10 rounded-xl text-white p-2 font-semibold text-2xl flex justify-center items-center gap-5 hover:-translate-y-1 transition-transform">
          Enviar{isUploading && <FireIcon />}
            </button>
        </form>
    );
};

const HighlightMapper: 
NextPage<{hl: Highlight, items: Item[]}> = (
    {hl, items}
) => {
    const [value, setvalue] = useState('');
    useEffect(() => {
        getNameFromID(hl.refID)
            .then(name => {setvalue(name); console.log('Setting ' + name);});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <select key={hl.id} value={value} onChange={(e) => {setvalue(e.target.value);}} className='border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl bg-white'>
            {items.map((item) => (
                <option key={item.id}>{item.nombre}</option>
            ))}
        </select>
    );
};

const FireIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>;
};

const findItemID = async (
    items: Item[], itemName: string
): Promise<Item> => {
    let foundItem: Item | undefined;
    items.forEach((item) => {
        if (item.nombre === itemName) {
            foundItem = item;
            return;
        }
    });
    if (foundItem !== undefined)
        return foundItem;
    else {
        return {
            id: '',
            nombre: '',
            categoria: '',
            image: '',
            precio: '',
            blur: '',
            descripcion: '',
        };
    }
};

const getNameFromID = async (id:string): Promise<string> => {
    const db = (await import('../../utils/db/webDB')).default;
    const { doc, getDoc } = await import(
        'firebase/firestore/lite'
    );
    const docRef = doc(db, 'articulos', id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        return docSnap.data().nombre;
    } else {
        return '';
    }
};

export default EditHighLight;
