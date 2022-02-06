import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DeleteCategory from '../components/UploadBoard/DeleteCategory';
import ModifyCategory from '../components/UploadBoard/ModifyCategory';
//import UploadItem from "../components/UploadBoard/UploadItem";
const UploadItem = dynamic(
    () => import('../components/UploadBoard/UploadItem')
);
const UploadCategory = dynamic(
    () => import('../components/UploadBoard/UploadCategory')
);
const ModifyItem = dynamic(
    () => import('../components/UploadBoard/ModifyItem')
);

type Item = {
    id: string;
    categoria: string;
    nombre: string;
    image: string;
    precio: number;
};

type Categories = {
    id: string;
    nombre: string;
};
interface Props {
  categories: Categories[];
  items: Item[];
}

const DBoard: NextPage<Props> = ({ categories, items }) => {
    const router = useRouter();


    const [subirArticuloSelected, setSubirArticuloSelected] =
    useState<boolean>(true);
    const [modificarArticuloSelected, setmodificarArticuloSelected] =
    useState<boolean>(false);
    const [subirCategoriaSelected, setSubirCategoriaSelected] =
    useState<boolean>(false);
    const [modificarCategoria,
        setModificarCategoria] = useState<boolean>(false);
    const [borrarCategoria, setBorrarCategoria] = useState<boolean>(false);
    useEffect(() => {
        if( Object.keys(router.query).length !== 0) {
            if(router.query.ma === ''){
                // Set main selected to true
                setmodificarArticuloSelected(true);
                // Set the rest to false
                setBorrarCategoria(false);
                setSubirArticuloSelected(false);
                setSubirCategoriaSelected(false);
                setModificarCategoria(false);
            } else if (router.query.cc === '') {
                // Set main selected to true
                setSubirCategoriaSelected(true);
                // Set the rest to false
                setBorrarCategoria(false);
                setSubirArticuloSelected(false);
                setmodificarArticuloSelected(false);
                setModificarCategoria(false);
            } else if (router.query.mc === '') {
                // Set main selected to true
                setModificarCategoria(true);
                // Set the rest to false
                setBorrarCategoria(false);
                setSubirArticuloSelected(false);
                setSubirCategoriaSelected(false);
                setmodificarArticuloSelected(false);
            } else if (router.query.bc === '') {
                // Set main selected to true
                setBorrarCategoria(true);
                // Set the rest to false
                setModificarCategoria(false);
                setSubirArticuloSelected(false);
                setSubirCategoriaSelected(false);
                setmodificarArticuloSelected(false);
            }
        }
    }, [router.query]);
    


    return (
        <div className="min-h-screen min-w-max max-w-[100vw] flex flex-col justify-start">
            <Head>
                <title>Board</title>
                <meta name="robots" content="nofollow"/>
            </Head>
            <div className="flex flex-row bg-blue-700/50 shadow shadow-blue-700/50 m-5 rounded-2xl">
                <PageSelector
                    name="Subir articulo"
                    selected={subirArticuloSelected}
                    onClick={() => {
                        // Set main selected to true
                        setSubirArticuloSelected(true);
                        // Set the rest to false
                        setSubirCategoriaSelected(false);
                        setmodificarArticuloSelected(false);
                        setModificarCategoria(false);
                        setBorrarCategoria(false);
                    }}
                />
                <PageSelector
                    name="Modificar articulo"
                    selected={modificarArticuloSelected}
                    onClick={() => {
                        // Set main selected to true
                        setmodificarArticuloSelected(true);
                        // Set the rest to false
                        setSubirArticuloSelected(false);
                        setSubirCategoriaSelected(false);
                        setBorrarCategoria(false);
                        setModificarCategoria(false);
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
                        setmodificarArticuloSelected(false);
                        setBorrarCategoria(false);
                        setModificarCategoria(false);
                    }}
                />
                <PageSelector
                    name="Modificar categoria"
                    selected={modificarCategoria}
                    onClick={() => {
                        // Set main selected to true
                        setModificarCategoria(true);
                        // Set the rest to false
                        setSubirArticuloSelected(false);
                        setSubirCategoriaSelected(false);
                        setBorrarCategoria(false);
                        setmodificarArticuloSelected(false);
                    }}
                />
                <PageSelector
                    name="Borrar categoria"
                    selected={borrarCategoria}
                    onClick={() => {
                        // Set main selected to true
                        setBorrarCategoria(true);
                        // Set the rest to false
                        setModificarCategoria(false);
                        setSubirArticuloSelected(false);
                        setSubirCategoriaSelected(false);
                        setmodificarArticuloSelected(false);
                    }}
                />
            </div>
            {subirArticuloSelected && <UploadItem categories={categories} />}
            {modificarArticuloSelected && 
            <ModifyItem categories={categories} items={items} />
            }
            {subirCategoriaSelected && <UploadCategory />}
            {modificarCategoria && 
            <ModifyCategory items={items} categories={categories} />
            }
            {borrarCategoria &&
             <DeleteCategory items={items} categories={categories} />
            }
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
    return {
        props: {
            categories: await getCategories(),
            items: await getItems(),
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
            id: doc.id,
            nombre: doc.data().nombre,
        });
    });
    return categories;
}

async function getItems(): Promise<Item[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query, orderBy } = await import(
        'firebase/firestore/lite'
    );
    const itemsColletion = collection(db, 'articulos');
    const q = query(itemsColletion, orderBy('categoria'));
    const snapshot = await getDocs(q);
    const items: Item[] = [];
    snapshot.forEach((doc) => {
        items.push({
            nombre: doc.data().nombre,
            image: doc.data().image,
            categoria: doc.data().categoria,
            precio: doc.data().precio || 1,
            id: doc.id,
        });
    });
    return items;
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
            <h1 className="bg-blue-600 p-3 shadow-lg shadow-blue-600/50 text-white rounded-xl m-2">
                {name}
            </h1>
        );
    }
    return (
        <h1
            className="bg-blue-300 p-3 shadow-sm shadow-blue-300/50 text-white rounded-xl m-2 cursor-pointer"
            onClick={onClick}>
            {name}
        </h1>
    );
};

export default DBoard;
