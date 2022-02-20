import { NextPage } from 'next';
import { createRef, FormEventHandler, useState } from 'react';
import CategoryForm from './CategoryForm';
import axios from '../../utils/fetch';
import { useRouter } from 'next/router';
import pride from '../../utils/pride';

const UploadCategory: NextPage = () => {
    const router = useRouter();
    const [isUploading, setisUploading] = useState(false);
    const categoryNameRef = createRef<HTMLInputElement>();

    const handleUploadCategory: 
    FormEventHandler<HTMLFormElement> = async (event) => {
        // meh
        event.preventDefault();
        setisUploading(true);
        const end = Date.now() + (500);
        const colors = [
            Math.floor(Math.random()*16777215).toString(16), 
            Math.floor(Math.random()*16777215).toString(16)
        ];
        const status = await axios.post('/api/category/upload',{ name: categoryNameRef.current?.value });
        if (status.status === 200) {
            router.prefetch('/dboard?cc');
            setisUploading(false);
            pride(end, colors);
            router.push('/dboard?cc');
            
        }
    };

    return <CategoryForm 
        onSubmit={handleUploadCategory} 
        nameForm={categoryNameRef} 
        isUploading={isUploading} />;
};

export default UploadCategory;
