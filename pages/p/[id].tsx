import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage, PreviewData } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import dynamic from 'next/dynamic';
const FullItem = dynamic(() => import('../../components/ItemsReview/FullItem'));

type Categories = {
    nombre: string;
};
type Item = {
    nombre: string;
    image: string;
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
            <div className='min-h-screen flex flex-col'>
                <Head>
                    <title>{id}</title>
                </Head>
                <Header categories={[{nombre: 'Cargando...'}]} />
                <h1 className='text-center text-5xl'>Cargando...</h1>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col'>
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
    return {
        props: {
            categories: await getCategories(),
            item: await getItem(context),
        },
        revalidate: 3600, // In seconds
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
    const items: Item[] = [];
    snapshot.forEach((doc) => {
        items.push({
            nombre: doc.data().nombre,
            image: doc.data().image,
        });
    });
    return items[0];
}

export default Product;
