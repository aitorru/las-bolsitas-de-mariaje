import type {
  NextPage,
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
// import ItemsReview from "../components/ItemsReview";
const ItemsReview = dynamic(() => import("../components/ItemsReview"), {
  suspense: true,
});
type Item = {
  nombre: string;
  image: string;
};
interface Props {
  items: Item[];
}

const Home: NextPage<Props> = (props) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
      </div>
      <Suspense fallback={<h1>Cargando...</h1>}>
        <ItemsReview items={props.items} />
      </Suspense>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const db = (await import("../utils/db/webDB")).default;
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const itemsColletion = collection(db, "articulos");
  const snapshot = await getDocs(itemsColletion);
  let items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push({
      nombre: doc.data().nombre,
      image: doc.data().image,
    });
  });
  return {
    props: {
      items,
    }, // will be passed to the page component as props
    revalidate: 3600, // In seconds
  };
};

export default Home;
