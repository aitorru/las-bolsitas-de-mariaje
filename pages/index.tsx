import { FirebaseStorage } from 'firebase/storage';
import type { NextPage, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getPlaiceholder } from 'plaiceholder';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { Highlight, Item, Carousel } from '../utils/types/types';
const ItemsReview = dynamic(() => import('../components/ItemsReview'));
const CarouselElement = dynamic(() => import('../components/Carousel'));
const Footer = dynamic(() => import('../components/Footer'));

type Categories = {
  nombre: string;
};
interface Props {
  items: Item[];
  categories: Categories[];
  carousel: Carousel[];
}

const Home: NextPage<Props> = (props) => {
    return (
        <>
            <Head>
                <title>Las bolsitas de Mariaje</title>
                <meta name="robots" content="index"/>
            </Head>
            <div className="flex flex-col md:min-h-screen">
                <Header categories={props.categories} />
                <Hero />
            </div>
            <div className='flex flex-col md:gap-10'>
                <h1 className="py-5 text-4xl font-bold text-center md:text-6xl text-ellipsis">
                    Promociones
                </h1>
                <CarouselElement carousel={props.carousel} />
            </div>
            <div id='destacados'>
                <ItemsReview title='Destacados' items={props.items} />
            </div>
            <Footer />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const [items, categories, carousel] = await Promise.all(
        [
            getItems(),
            getCategories(),
            getCarousel()
        ]
    );
    return {
        props: {
            items,
            categories,
            carousel,
        }, // will be passed to the page component as props
    };
};

async function getItems(): Promise<Item[]> {
    const db = (await import('../utils/db/webDB')).default;
    const {app} = await import('../utils/db/webDB');
    const { collection, getDocs, query, orderBy, doc, getDoc } = await import(
        'firebase/firestore/lite'
    );
    const { getStorage } = await import('firebase/storage');
    const storage = getStorage(app);
    const itemsColletion = collection(db, 'highlight');
    const q = query(itemsColletion, orderBy('pos'));
    const snapshot = await getDocs(q);
    const hls: Highlight[] = [];
    snapshot.forEach((doc) => {
        hls.push({
            id: doc.id,
            refID: doc.data().refID,
            pos: doc.data().pos,
        });
    });
    const items: Item[] = await Promise.all(hls.map(async (hl) => {
        const docRef = doc(db, 'articulos', hl.refID);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            return {
                id: docSnap.id,
                categoria: docSnap.data().categoria,
                nombre: docSnap.data().nombre,
                image: docSnap.data().image,
                imageUrl: docSnap.data().imageUrl || '',
                precio: docSnap.data().precio,
                descripcion: docSnap.data().descripcion,
                blur: docSnap.data().blur || '',
            };
        } else {
            return {
                id: '',
                categoria: '',
                nombre: '',
                image: 'gs://las-bolsitas-de-mariaje.appspot.com/220px-Red_X.svg.png',
                imageUrl: '',
                precio: '-',
                descripcion: '',
                blur: '',
            };
        }
    }));
    // Promise.all mixes the array
    items.sort(function(a, b) {
        const hla: Highlight | undefined = hls.find(hl => {
            return hl.refID === a.id;
        });
        const hlb : Highlight | undefined = hls.find(hl => {
            return hl.refID === b.id;
        });
        if (hla !== undefined && hlb !== undefined) {
            return hla.pos - hlb.pos;
        } else {
            return 1;
        }
    }
    );
    const result: Item[] = await Promise.all(items.map(async (item) => {
        if (item.imageUrl !== '') {
            return item;
        }
        return {
            id: item.id,
            nombre: item.nombre,
            image: item.image,
            imageUrl: await getUrlFromRef(storage, item.image),
            categoria: item.categoria,
            precio: item.precio,
            descripcion: item.descripcion,
            blur: item.blur
        };
    }));
    const whithPlaceHolder: Item[] = await Promise.all(
        result.map(async (item) => {
            if(item.blur !== '') {
                return item;
            }
            const buffer = await fetch(item.imageUrl).then(async (res) =>
                Buffer.from(await res.arrayBuffer())
            );
            return {
                id: item.id,
                nombre: item.nombre,
                image: item.image,
                imageUrl: item.imageUrl,
                blur: (await getPlaiceholder(buffer)).base64,
                categoria: item.categoria,
                precio: item.precio,
                descripcion: item.descripcion

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

async function getCarousel(): Promise<Carousel[]> {
    const db = (await import('../utils/db/webDB')).default;
    const { collection, getDocs, query, orderBy } = await import(
        'firebase/firestore/lite'
    );
    const {app} = await import('../utils/db/webDB');
    const { getStorage } = await import('firebase/storage');
    const storage = getStorage(app);
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
            blur: doc.data().blur || '',
        });
    });
    const result: Carousel[] = await Promise.all(carousel.map(async (item) => {
        if(item.imageUrl !== '') {
            return item;
        }
        return {
            id: item.id,
            image: item.image,
            imageUrl: await getUrlFromRef(storage, item.image),
            blur: item.blur,
            pos: item.pos
        };
    }));
    const whithPlaceHolder: Carousel[] = await Promise.all(
        result.map(async (item) => {
            if(item.blur !== '') {
                return item;
            }
            let buffer;
            if (item.imageUrl === undefined) {
                // Create an empty buffer
                buffer = Buffer.alloc(0);
            } else {
                buffer = await fetch(item.imageUrl).then(async (res) =>
                    Buffer.from(await res.arrayBuffer())
                );
            }
            
            return {
                id: item.id,
                image: item.image,
                imageUrl: item.imageUrl,
                blur: (await getPlaiceholder(buffer)).base64,
                pos: item.pos

            };
        }));
    return whithPlaceHolder;
}

export default Home;
