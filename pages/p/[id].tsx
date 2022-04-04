import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage, PreviewData } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import dynamic from 'next/dynamic';
import { FirebaseStorage } from 'firebase/storage';
import { Item } from '../../utils/types/types';
import { getPlaiceholder } from 'plaiceholder';
const FullItem = dynamic(() => import('../../components/ItemsReview/FullItem'));

type Categories = {
    nombre: string;
};
interface Props {
    categories: Categories[];
    item: Item;
}

const Product: NextPage<Props> = ({categories, item}) => {
    const router = useRouter();
    const { id } = router.query;

    if (router.isFallback) {
        return (
            <div className='flex flex-col min-h-screen'>
                <Head>
                    <title>{id}</title>
                </Head>
                <Header categories={[{nombre: 'Cargando...'}]} />
                <h1 className='text-5xl text-center'>Cargando...</h1>
            </div>
        );
    }

    return (
        <div className='flex flex-col max-h-screen min-h-screen'>
            <Head>
                <title>{id}</title>
            </Head>
            <Header categories={categories} />
            <FullItem item={item} />
        </div>
    );
};


export const getStaticPaths: GetStaticPaths = async () => {
    const db = (await import('../../utils/db/webDB')).default;
    const { collection, getDocs } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'articulos');
    const snapshot = await getDocs(itemsColletion);
    const PATHS: { params: { id: string } }[] = [];
    snapshot.forEach((doc) => {
        PATHS.push({
            params: { id: doc.data().nombre },
        });
    });
    return {
        paths: PATHS,
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const [ categories, item ] = await Promise.all(
        [
            getCategories(), getItem(context)
        ]
    );
    return {
        props: {
            categories,
            item,
        },
        revalidate: 86400,
    };
};

async function getCategories(): Promise<Categories[]> {
    const db = (await import('../../utils/db/webDB')).default;
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
async function getItem(
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
) {
    const db = (await import('../../utils/db/webDB')).default;
    const { collection, getDocs, query, where } = await import(
        'firebase/firestore/lite'
    );
    const itemsColletion = collection(db, 'articulos');
    const q = query(
        itemsColletion,
        where('nombre', '==', context?.params?.id)
    );
    const snapshot = await getDocs(q);
    const {app} = await import('../../utils/db/webDB');
    const {getStorage } = await import('firebase/storage');
    const storage = getStorage(app);
    const items: Item[] = [];
    snapshot.forEach((doc) => {
        items.push({
            id: doc.id,
            nombre: doc.data().nombre,
            image: doc.data().image,
            categoria: doc.data().categoria,
            precio: doc.data().precio,
            descripcion: doc.data().descripcion,
            blur: '',
        });
    });
    const result: Item[] = await Promise.all(items.map(async (item) => {
        return {
            id: item.id,
            nombre: item.nombre,
            image: await getUrlFromRef(storage, item.image),
            categoria: item.categoria,
            precio: item.precio,
            descripcion: item.descripcion,
            blur: '',
        };
    }));
    const whithPlaceHolder: Item[] = await Promise.all(
        result.map(async (item) => {
            return {
                id: item.id,
                nombre: item.nombre,
                image: item.image,
                blur: (await getPlaiceholder(item.image)).base64,
                categoria: item.categoria,
                descripcion: item.descripcion,
                precio: item.precio,
            };
        }));
    return whithPlaceHolder[0];
}

async function getUrlFromRef(
    storage: FirebaseStorage,
    image: string
): Promise<string> {
    const { ref, getDownloadURL } = await import('firebase/storage');
    const reference = ref(storage, image);
    const url = await getDownloadURL(reference);
    return url;
    
}

export default Product;

