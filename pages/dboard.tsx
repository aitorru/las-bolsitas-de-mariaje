import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
//import UploadItem from "../components/UploadBoard/UploadItem";
const UploadItem = dynamic(
    () => import('../components/UploadBoard/UploadItem')
);
const UploadCategory = dynamic(
    () => import('../components/UploadBoard/UploadCategory')
);

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const DBoard: NextPage<Props> = ({ categories }) => {
    const [subirArticuloSelected, setSubirArticuloSelected] =
    useState<boolean>(true);
    const [subirCategoriaSelected, setSubirCategoriaSelected] =
    useState<boolean>(false);
    return (
        <div className="min-h-screen min-w-max max-w-[100vw] flex flex-col justify-start">
            <Head>
                <title>Board</title>
            </Head>
            <div className="flex flex-row bg-slate-50 shadow shadow-slate-100">
                <PageSelector
                    name="Subir articulo"
                    selected={subirArticuloSelected}
                    onClick={() => {
                        // Set main selected to true
                        setSubirArticuloSelected(true);
                        // Set the rest to false
                        setSubirCategoriaSelected(false);
                    }}
                />
                <PageSelector
                    name="Crear categoria"
                    selected={subirCategoriaSelected}
                    onClick={() => {
                        // Set main selected to true
                        setSubirCategoriaSelected(true);
                        // Set the rest to false
                        setSubirArticuloSelected(false);
                    }}
                />
            </div>
            {subirArticuloSelected && <UploadItem categories={categories} />}
            {subirCategoriaSelected && <UploadCategory />}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
    return {
        props: {
            categories: await getCategories(),
        },
    };
};

async function getCategories(): Promise<Categories[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'categorias');
    const snapshot = await getDocs(itemsColletion);
    const categories: Categories[] = [];
    snapshot.forEach((doc) => {
        categories.push({
            nombre: doc.data().nombre,
        });
    });
    return categories;
}

interface PropsPageSelector {
  name: string;
  selected: boolean;
  onClick?: () => void;
}

const PageSelector: NextPage<PropsPageSelector> = ({
    name,
    selected,
    onClick,
}) => {
    if (selected) {
        return (
            <h1 className="bg-blue-600 p-3 shadow-lg shadow-blue-600/50 text-white rounded-xl m-10">
                {name}
            </h1>
        );
    }
    return (
        <h1
            className="bg-blue-300 p-3 shadow-sm shadow-blue-300/50 text-white rounded-xl m-10 cursor-pointer"
            onClick={onClick}>
            {name}
        </h1>
    );
};

export default DBoard;
