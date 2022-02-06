import { FirebaseStorage } from 'firebase/storage';
import type { NextPage, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { Item } from '../utils/types/types';
const ItemsReview = dynamic(() => import('../components/ItemsReview'));

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
                <meta name="robots" content="index"/>
            </Head>
            <div className="md:min-h-screen flex flex-col">
                <Header categories={props.categories} />
                <Hero />
            </div>
            <div id='destacados'>
                <ItemsReview title='Destacados' items={props.items} />
            </div>
            
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
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
    const {app} = await import('../utils/db/webDB');
    const { collection, getDocs, query, limit } = await import(
        'firebase/firestore/lite'
    );
    const {getStorage } = await import('firebase/storage');
    const storage = getStorage(app);
    const itemsColletion = collection(db, 'articulos');
    const q = query(itemsColletion, limit(6));
    const snapshot = await getDocs(q);
    const items: Item[] = [];
    snapshot.forEach((doc) => {
        items.push({
            id: doc.id,
            nombre: doc.data().nombre,
            image: doc.data().image,
            categoria: doc.data().categoria,
            precio: doc.data().precio,
        });
    });
    const result = await Promise.all(items.map(async (item) => {
        return {
            id: item.id,
            nombre: item.nombre,
            image: await getUrlFromRef(storage, item.image),
            categoria: item.categoria,
            precio: item.precio,
        };
    }));
    return result;
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
