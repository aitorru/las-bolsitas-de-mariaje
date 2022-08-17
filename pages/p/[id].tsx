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
                <LoadingFullPage />
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
    // TODO: Clean this up. Images are now being blured in the server.
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
            imageUrl: doc.data().imageUrl || '',
            categoria: doc.data().categoria,
            precio: doc.data().precio,
            descripcion: doc.data().descripcion,
            blur: doc.data().blur || '',
        });
    });
    console.log(items);
    if(items[0].blur && items[0].imageUrl) {
        return items[0];
    }
    const result: Item[] = await Promise.all(items.map(async (item) => {
        return {
            id: item.id,
            nombre: item.nombre,
            image: item.image,
            imageUrl: await getUrlFromRef(storage, item.image),
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
                imageUrl: item.imageUrl,
                blur: (await getPlaiceholder(item.imageUrl)).base64,
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


function LoadingFullPage() {
    return (<div className='container items-center justify-center flex-grow h-full max-h-full mx-auto my-5 grid md:grid-cols-2 gap-5'>
        <div className='relative w-[90%] min-h-[20rem] md:h-[80%] md:w-[80%] mx-auto'>
            <div className="bg-gray-300 w-96 h-96 animate-pulse rounded-sm opacity-10"></div>
        </div>
        <div className='flex flex-col justify-center w-11/12 mx-auto gap-10'>
            <div className='bg-gray-300 w-full h-12 animate-pulse rounded-sm opacity-10'></div>
            <div className='bg-gray-300 w-full h-12 animate-pulse rounded-sm opacity-10'></div>
            <div className='bg-gray-300 w-full h-12 animate-pulse rounded-sm opacity-10'></div>
            <a className='flex flex-row items-center justify-center px-10 py-3 mb-5 text-4xl font-bold text-center text-white bg-blue-700 opacity-30 cursor-not-allowed shadow-2xl md:mb-0 shadow-blue-700/50 rounded-2xl' rel="noreferrer">...</a>
        </div>
    </div>);
}
  