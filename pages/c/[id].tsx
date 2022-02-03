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
import { ParsedUrlQuery } from 'querystring';
import Header from '../../components/Header';
const ItemsReview = dynamic(() => import('../../components/ItemsReview'));

type Categories = {
  nombre: string;
};
type Item = {
  nombre: string;
  image: string;
};
interface Props {
  categories: Categories[];
  items: Item[];
}

const CategoryName: NextPage<Props> = ({ categories, items }) => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <Head>
                <title>{id}</title>
            </Head>
            <Header categories={categories} />
            <ItemsReview title={'Categoria: ' + id } items={items} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            categories: await getCategories(),
            items: await getItems(context),
        },
        revalidate: 3600, // In seconds
    };
};

async function getItems(
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
) {
    const db = (await import('../../utils/db/webDB')).default;
    const { collection, getDocs, query, where } = await import(
        'firebase/firestore/lite'
    );
    const itemsColletion = collection(db, 'articulos');
    const q = query(
        itemsColletion,
        where('categoria', '==', context?.params?.id)
    );
    const snapshot = await getDocs(q);
    const items: Item[] = [];
    snapshot.forEach((doc) => {
        items.push({
            nombre: doc.data().nombre,
            image: doc.data().image,
        });
    });
    return items;
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
        fallback: false, // false or 'blocking'
    };
};

export default CategoryName;
