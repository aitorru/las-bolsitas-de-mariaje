import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Carousel, Category, Highlight, Item } from '../utils/types/types';
const UploadItem = dynamic(
    () => import('../components/UploadBoard/UploadItem')
);
const UploadCategory = dynamic(
    () => import('../components/UploadBoard/UploadCategory')
);
const ModifyItem = dynamic(
    () => import('../components/UploadBoard/ModifyItem')
);
const DeleteCategory = dynamic(
    () => import('../components/UploadBoard/DeleteCategory')
);
const EditHighLight = dynamic(
    () => import('../components/UploadBoard/EditHighlight')
);
const ModifyCategory = dynamic(
    () => import('../components/UploadBoard/ModifyCategory')
);
const CarouselEdit = dynamic(
    () => import('../components/UploadBoard/UpdatePromotions')
);
interface Props {
  categories: Category[];
  items: Item[];
  highlights: Highlight[];
  carousel: Carousel[];
}

const DBoard: NextPage<Props> = (
    { categories, items, highlights, carousel }
) => {
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
    const [editarDestacados, setEditarDestacados] = useState(false);
    const [editarPromociones, setEditarPromociones] = useState(false);
    useEffect(() => {
        if( Object.keys(router.query).length !== 0) {
            if(router.query.ma === ''){  // lasbolsitasdemariaje.es/dboard?ma
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
            } else if (router.query.eh === '') {
                // Set main selected to true
                setEditarDestacados(true);
                // Set the rest to false
                setBorrarCategoria(false);
                setModificarCategoria(false);
                setSubirArticuloSelected(false);
                setSubirCategoriaSelected(false);
                setmodificarArticuloSelected(false);
            } else if (router.query.up === '') {
                // Set main selected to true
                setEditarPromociones(true);
                // Set the rest to false
                setEditarDestacados(false);
                setBorrarCategoria(false);
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
            <div className="flex flex-row m-5 shadow bg-blue-700/50 shadow-blue-700/50 rounded-2xl">
                <PageSelector
                    name="Subir articulo"
                    selected={subirArticuloSelected}
                    onClick={() => {
                        // Set main selected to true
                        setSubirArticuloSelected(true);
                        // Set the rest to false
                        setSubirCategoriaSelected(false);
                        setmodificarArticuloSelected(false);
                        setEditarDestacados(false);
                        setEditarPromociones(false);
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
                        setEditarPromociones(false);
                        setEditarDestacados(false);
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
                        setEditarPromociones(false);
                        setEditarDestacados(false);
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
                        setEditarDestacados(false);
                        setEditarPromociones(false);
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
                        setEditarPromociones(false);
                        setEditarDestacados(false);
                        setModificarCategoria(false);
                        setSubirArticuloSelected(false);
                        setSubirCategoriaSelected(false);
                        setmodificarArticuloSelected(false);
                    }}
                />
                <PageSelector
                    name="Editar Destacados"
                    selected={editarDestacados}
                    onClick={() => {
                        // Set main selected to true
                        setEditarDestacados(true);
                        // Set the rest to false
                        setEditarPromociones(false);
                        setBorrarCategoria(false);
                        setModificarCategoria(false);
                        setSubirArticuloSelected(false);
                        setSubirCategoriaSelected(false);
                        setmodificarArticuloSelected(false);
                    }}
                />
                <PageSelector
                    name="Editar Promociones"
                    selected={editarPromociones}
                    onClick={() => {
                        // Set main selected to true
                        setEditarPromociones(true);
                        // Set the rest to false
                        setEditarDestacados(false);
                        setBorrarCategoria(false);
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
            {editarDestacados && 
            <EditHighLight highlights={highlights} items={items} />
            }
            {editarPromociones && <CarouselEdit carousel={carousel} />}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const [ categories, items, highlights, carousel ] = await Promise.all(
        [
            getCategories(),
            getItems(),
            getHighlight(),
            getCarousel(),
        ]
    );
    return {
        props: {
            categories,
            items,
            highlights,
            carousel,
        },
    };
};
async function getHighlight(): Promise<Highlight[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query,orderBy } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'highlight');
    const q = query(itemsColletion, orderBy('pos'));
    const snapshot = await getDocs(q);
    const highlights: Highlight[] = [];
    snapshot.forEach((doc) => {
        highlights.push({
            id: doc.id,
            refID: doc.data().refID,
            pos: doc.data().pos
        });
    });
    return highlights;

}

async function getCategories(): Promise<Category[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'categorias');
    const q = query(itemsColletion, orderBy('nombre'));
    const snapshot = await getDocs(q);
    const categories: Category[] = [];
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
            imageUrl: doc.data().imageUrl || '',
            categoria: doc.data().categoria,
            precio: doc.data().precio,
            descripcion: doc.data().descripcion || '',
            id: doc.id,
            blur: doc.data().blur || '',
        });
    });
    return items;
}

async function getCarousel(): Promise<Carousel[]> {
    // TODO: Carousel is not blured in the db
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query, orderBy } = await import(
        'firebase/firestore/lite'
    );
    const itemsColletion = collection(db, 'carousel');
    const q = query(itemsColletion, orderBy('pos'));
    const snapshot = await getDocs(q);
    const carousel: Carousel[] =[];
    snapshot.forEach((doc) => {
        carousel.push({
            id: doc.id,
            pos: doc.data().pos,
            image: doc.data().image,
            imageUrl: doc.data().imageUrl || '',
            blur: doc.data().imageUrl || '',
        });
    });
    return carousel;
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
            <h1 className="p-3 m-2 text-white bg-blue-600 shadow-lg shadow-blue-600/50 rounded-xl">
                {name}
            </h1>
        );
    }
    return (
        <h1
            className="p-3 m-2 text-white bg-blue-300 cursor-pointer shadow-sm shadow-blue-300/50 rounded-xl"
            onClick={onClick}>
            {name}
        </h1>
    );
};

export default DBoard;
