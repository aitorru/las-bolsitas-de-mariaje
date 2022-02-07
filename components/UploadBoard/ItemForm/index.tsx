import { NextPage } from 'next';
import { FormEventHandler, RefObject } from 'react';

type Categories = {
    nombre: string;
};

interface Props {
    onSubmit: FormEventHandler<HTMLFormElement>;
    nameForm: RefObject<HTMLInputElement>;
    priceForm: RefObject<HTMLInputElement>;
    categoryForm: RefObject<HTMLSelectElement>;
    imageForm: RefObject<HTMLInputElement>;
    categories: Categories[];
    isUploading: boolean;
    isNameRequired?: boolean;
    defaultOption?: string;
}

const ItemForm: NextPage<Props> = (
    {
        onSubmit,
        isUploading,
        nameForm,
        priceForm,
        categoryForm,
        categories,
        imageForm,
        isNameRequired,
        defaultOption
    }
) => {
    return <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center content-center w-11/12 md:w-9/12 mx-auto gap-3">
        <label className="text-center text-3xl">
          Nombre
        </label>
        <input
            type="text"
            placeholder='Bolsa...'
            required={isNameRequired}
            className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl"
            ref={nameForm}
        />
        <label className="text-center text-3xl">
          Precio
        </label>
        <input
            type="text"
            placeholder='10.95'
            required={isNameRequired}
            className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl"
            ref={priceForm}
        />
        <label className="text-center text-3xl">
          Categoria
        </label>
        <select
            defaultValue={defaultOption}
            className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl bg-white"
            ref={categoryForm}>
            {categories.map((category) => (
                <option key={category.nombre}>{category.nombre}</option>
            ))}
        </select>
        <label className="text-center text-3xl">Imagen</label>
        <input
            type="file"
            accept="image/*"
            required={isNameRequired}
            className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl"
            ref={imageForm}
        />
        <button
            type="submit"
            className="bg-blue-600 shadow-xl shadow-blue-600/10 rounded-xl text-white p-2 font-semibold text-2xl flex justify-center items-center gap-5 hover:-translate-y-1 transition-transform">
          Enviar{isUploading && <FireIcon />}
        </button>
    </form>;
};

const FireIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>;
};

export default ItemForm;
