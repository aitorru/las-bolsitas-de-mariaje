import { FirebaseStorage } from 'firebase/storage';
import type {
    NextPage,
    GetStaticProps,
    GetStaticPaths,
    GetStaticPropsContext,
    PreviewData,
} from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getPlaiceholder } from 'plaiceholder';
import { ParsedUrlQuery } from 'querystring';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Item } from '../../utils/types/types';
const ItemsReview = dynamic(() => import('../../components/ItemsReview'));

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
  items: Item[];
}

const CategoryName: NextPage<Props> = ({ categories, items }) => {
    const router = useRouter();
    const { id } = router.query;

    if (router.isFallback) {
        return (
            <>
                <Head>
                    <title>{id}</title>
                </Head>
                <Header categories={[{nombre: 'Cargando...'}]} />
                <ItemsReview title={'Categoria: ' + id } items={[]} />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{id}</title>
            </Head>
            <Header categories={categories} />
            <ItemsReview title={`${id}`} items={items} />
            <Footer />
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            categories: await getCategories(),
            items: await getItems(context),
        },
    };
};

async function getItems(
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
) {
    const db = (await import('../../utils/db/webDB')).default;
    const { collection, getDocs, query, where } = await import(
        'firebase/firestore/lite'
    );
    const {app} = await import('../../utils/db/webDB');
    const {getStorage } = await import('firebase/storage');
    const itemsColletion = collection(db, 'articulos');
    const q = query(
        itemsColletion,
        where('categoria', '==', context?.params?.id)
    );
    const snapshot = await getDocs(q);
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
    return whithPlaceHolder;
}

async function getUrlFromRef(
    storage: FirebaseStorage,
    image: string
): Promise<string> {
    const { ref, getDownloadURL } = await import('firebase/storage');
    const reference = ref(storage, image);
    return await getDownloadURL(reference);
}

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

export const getStaticPaths: GetStaticPaths = async () => {
    const db = (await import('../../utils/db/webDB')).default;
    const { collection, getDocs } = await import('firebase/firestore/lite');
    const itemsColletion = collection(db, 'categorias');
    const snapshot = await getDocs(itemsColletion);
    const PATHS: { params: { id: string } }[] = [];
    snapshot.forEach((doc) => {
        PATHS.push({
            params: { id: doc.data().nombre },
        });
    });
    return {
        paths: PATHS,
        fallback: true, // false or 'blocking'
    };
};

export default CategoryName;
