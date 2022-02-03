import type { NextPage, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
const ItemsReview = dynamic(() => import('../components/ItemsReview'));
type Item = {
  nombre: string;
  image: string;
};
type Categories = {
  nombre: string;
};
interface Props {
  items: Item[];
  categories: Categories[];
}

const Home: NextPage<Props> = (props) => {
    return (
        <>
            <Head>
                <title>Las bolsitas de mariaje</title>
            </Head>
            <div className="md:min-h-screen flex flex-col">
                <Header categories={props.categories} />
                <Hero />
            </div>
            <ItemsReview items={props.items} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async (_context) => {
    return {
        props: {
            items: await getItems(),
            categories: await getCategories(),
        }, // will be passed to the page component as props
        revalidate: 3600, // In seconds
    };
};

async function getItems(): Promise<Item[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query, limit } = await import(
        'firebase/firestore/lite'
    );
    const itemsColletion = collection(db, 'articulos');
    const q = query(itemsColletion, limit(6));
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

export default Home;
