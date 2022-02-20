/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import { NextPage } from 'next';
import { createRef, useEffect, useState } from 'react';
import { app } from '../../utils/db/webDB';
import { ref, getDownloadURL, getStorage } from 'firebase/storage';
import { Carousel } from '../../utils/types/types';
import axios from '../../utils/fetch/index';
import pride from '../../utils/pride';
//import ItemDetail from './ItemDetail';

interface Props {
    carousel: Carousel[];
}

const CarouselEdit: NextPage<Props> = ({ carousel }) => {
    return (
        <div className='container mx-auto flex flex-col gap-5 my-5'>
            {
                carousel.map(item => <CarouselEditDetail 
                    key={item.id} 
                    item={item} 
                />)
            }
        </div>
    );
};

interface PassProps {
    item: Carousel;
}

const CarouselEditDetail: NextPage<PassProps> = ({item}) => {
    const imageTag = createRef<HTMLImageElement>();
    const imageForm = createRef<HTMLInputElement>();
    const [isUploading, setIsUploading] = useState(false);
    useEffect(() => {
        const storage = getStorage(app);
        const reference = ref(storage, item.image);
        getDownloadURL(reference).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', url);
            xhr.send();
            imageTag.current?.setAttribute('src', url);
        });
    }, [imageTag, item.image]);

    const handleSubmit = async () => {
        const end = Date.now() + (500);
        const colors = [
            Math.floor(Math.random()*16777215).toString(16), 
            Math.floor(Math.random()*16777215).toString(16)
        ];
        setIsUploading(true);
        const body = new FormData();
        body.append('id', item.id);
        const files = imageForm.current?.files;
        if (files === null) {
            alert('La imagen esta vacia');
            return;
        } else {
            if(files === undefined){
                alert('La imagen esta vacia');
                return;
            } else {
                body.append('image', files[0]);
            }
        }
        const status = await axios.post('/api/carousel/edit', body);
        if(status.status === 200) {
            pride(end, colors);
            setIsUploading(false);
        } else {
            if(((await axios.post('/api/carousel/edit', body)).status === 200)){
                pride(end, colors);
                setIsUploading(false);
            } else {
                alert('Modificacion incorrecta');
                setIsUploading(false);
            }
        }
    };
    return (
        <div className='flex flex-col justify-center gap-10'>
            <div className='grid grid-cols-2 justify-evenly'>
                <img ref={imageTag} alt='' width={'200rem'} />
                <form>
                    <input type="file"
                        accept="image/*"
                        ref={imageForm}
                        className='border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl'
                    />
                </form>
            </div>
            <button
                onClick={handleSubmit}
                className='bg-blue-600 shadow-xl shadow-blue-600/10 rounded-xl text-white p-2 font-semibold text-2xl flex justify-center items-center gap-5 hover:-translate-y-1 transition-transform'>
                Subir{isUploading && <FireIcon />}
            </button>
        </div>
    );

};
const FireIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>;
};

export default CarouselEdit;
