"use client";

import { NextPage } from 'next';
import { createRef, FormEventHandler, useState } from 'react';
import CategoryForm from './CategoryForm';
import { useRouter } from 'next/navigation';
import pride from '../../utils/pride';
import { uploadCategoryAction } from '../../app/dboard/actions';

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
        const result = await uploadCategoryAction(
            categoryNameRef.current?.value || ''
        );
        if (result.status === 200) {
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
