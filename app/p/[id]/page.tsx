import { FirebaseStorage } from "firebase/storage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import FullItem from "../../../components/ItemsReview/FullItem";
import { Item } from "../../../utils/types/types";
import { getPlaiceholder } from "plaiceholder";

export const revalidate = 3600;

type Categories = {
  nombre: string;
};

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const db = (await import("../../../utils/db/webDB")).default;
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const itemsColletion = collection(db, "articulos");
  const snapshot = await getDocs(itemsColletion);
  const paths: { id: string }[] = [];
  snapshot.forEach((doc) => {
    const nombre = doc.data().nombre;
    if (typeof nombre === "string" && nombre.length > 0) {
      paths.push({
        id: encodeURIComponent(nombre),
      });
    }
  });
  return paths;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const itemId = decodeParam(params.id);
  return {
    title: itemId,
  };
}

export default async function ProductPage({ params }: Props) {
  const itemId = decodeParam(params.id);
  const [categories, item] = await Promise.all([
    getCategories(),
    getItem(itemId),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col max-h-screen min-h-screen">
      <Header categories={categories} />
      <div className="mx-auto w-11/12 md:w-9/12 text-xs text-gray-500">
        debug: id="{itemId}" item={item ? "yes" : "no"} categories=
        {categories.length}
      </div>
      <FullItem item={item} />
    </div>
  );
}

async function getCategories(): Promise<Categories[]> {
  const db = (await import("../../../utils/db/webDB")).default;
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const itemsColletion = collection(db, "categorias");
  const snapshot = await getDocs(itemsColletion);
  const categories: Categories[] = [];
  snapshot.forEach((doc) => {
    categories.push({
      nombre: doc.data().nombre,
    });
  });
  return categories;
}

async function getItem(id: string): Promise<Item | null> {
  if (!id) {
    return null;
  }
  const db = (await import("../../../utils/db/webDB")).default;
  const { collection, getDocs, query, where } = await import(
    "firebase/firestore/lite"
  );
  const itemsColletion = collection(db, "articulos");
  const q = query(itemsColletion, where("nombre", "==", id));
  const snapshot = await getDocs(q);
  const { app } = await import("../../../utils/db/webDB");
  const { getStorage } = await import("firebase/storage");
  const storage = getStorage(app);
  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      nombre: doc.data().nombre,
      image: doc.data().image,
      imageUrl: doc.data().imageUrl || "",
      categoria: doc.data().categoria,
      precio: doc.data().precio,
      descripcion: doc.data().descripcion,
      blur: doc.data().blur || "",
    });
  });
  if (items.length === 0) {
    return null;
  }
  if (items[0].blur && items[0].imageUrl) {
    return items[0];
  }
  const result: Item[] = await Promise.all(
    items.map(async (item) => {
      return {
        id: item.id,
        nombre: item.nombre,
        image: item.image,
        imageUrl: await getUrlFromRef(storage, item.image),
        categoria: item.categoria,
        precio: item.precio,
        descripcion: item.descripcion,
        blur: "",
      };
    })
  );
  const withPlaceHolder: Item[] = await Promise.all(
    result.map(async (item) => {
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
        descripcion: item.descripcion,
        precio: item.precio,
      };
    })
  );
  return withPlaceHolder[0];
}

async function getUrlFromRef(
  storage: FirebaseStorage,
  image: string
): Promise<string> {
  const { ref, getDownloadURL } = await import("firebase/storage");
  const reference = ref(storage, image);
  const url = await getDownloadURL(reference);
  return url;
}

function decodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}
