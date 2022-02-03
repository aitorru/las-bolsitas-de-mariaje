/* eslint-disable react/prop-types */
import { NextPage } from 'next';
import { createRef, FormEventHandler } from 'react';

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const UploadItem: NextPage<Props> = ({ categories }) => {
    const nameForm = createRef<HTMLInputElement>();
    const categoryForm = createRef<HTMLSelectElement>();
    const imageForm = createRef<HTMLInputElement>();
    const loginUser: FormEventHandler<HTMLFormElement> = async (event) => {
        // Fuck browsers
        event.preventDefault();
        const body = new FormData();
        body.append('name', nameForm.current?.value || '');
        body.append('category', categoryForm.current?.value || '');
        const files = imageForm.current?.files;
        if (files === null) {
            alert('La imagen esta vacia');
        } else {
            if(files === undefined){
                alert('La imagen esta vacia');
            } else {
                body.append('image', files[0]);
            }
        }
        const status = await fetch('/api/upload', {method: 'POST', body});
        if (status.status === 200){ 
            alert('Subida correcta');
        }
    };
    return (
        <div className="container mx-auto flex flex-col justify-center content-center mt-5">
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
                    className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl"
                    ref={nameForm}
                />
                <label htmlFor="name" className="text-center text-3xl">
          Categoria
                </label>
                <select
                    name="cars"
                    id="cars"
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
                    required
                    className="border-blue-600 shadow-lg shadow-blue-600/50 border-2 p-2 px-5 rounded-xl text-xl"
                    ref={imageForm}
                />
                <button
                    type="submit"
                    className="bg-blue-600 shadow-xl shadow-blue-600/10 rounded-xl text-white p-2 font-semibold text-2xl">
          Subir
                </button>
            </form>
        </div>
    );
};

export default UploadItem;
