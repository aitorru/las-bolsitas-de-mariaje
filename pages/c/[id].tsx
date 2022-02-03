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
const Card = dynamic(() => import('../../components/ItemsReview/Card'));

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
            <div className="container mx-auto w-11/12 md:w-full">
                <h1 className="mx-auto text-center text-6xl mt-5">Categoria: {id}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32 w-11/12 md:w-full mx-auto mt-10">
                    {items.map((item) => (
                        <Card key={item.image} nombre={item.nombre} image={item.image} />
                    ))}
                </div>
            </div>
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
