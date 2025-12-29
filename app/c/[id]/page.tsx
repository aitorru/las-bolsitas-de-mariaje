import { FirebaseStorage } from "firebase/storage";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ItemsReview from "../../../components/ItemsReview";
import { Item } from "../../../utils/types/types";
import { getPlaiceholder } from "plaiceholder";

export const revalidate = 3600;

type Categories = {
  nombre: string;
};

type Props = {
  params: { id?: string };
  searchParams?: { id?: string };
};

export async function generateStaticParams() {
  const db = (await import("../../../utils/db/webDB")).default;
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const itemsColletion = collection(db, "categorias");
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
  const categoryId = decodeParam(params.id ?? "");
  return {
    title: categoryId || "Categoria",
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const rawId = params.id ?? searchParams?.id ?? "";
  const categoryId = decodeParam(rawId);
  const requestHeaders = headers();
  const debugHeaders = {
    "x-matched-path": requestHeaders.get("x-matched-path") ?? "",
    "x-nextjs-pathname": requestHeaders.get("x-nextjs-pathname") ?? "",
    "x-nextjs-page": requestHeaders.get("x-nextjs-page") ?? "",
    "x-invoke-path": requestHeaders.get("x-invoke-path") ?? "",
    "x-invoke-query": requestHeaders.get("x-invoke-query") ?? "",
    "x-url": requestHeaders.get("x-url") ?? "",
    "x-vercel-id": requestHeaders.get("x-vercel-id") ?? "",
  };
  const [categories, items] = await Promise.all([
    getCategories(),
    getItems(categoryId),
  ]);

  return (
    <>
      <Header categories={categories} />
      <div className="mx-auto w-11/12 md:w-9/12 text-xs text-gray-500">
        debug: raw={String(rawId)} id={String(categoryId)} items=
        {items.length} categories={categories.length}
      </div>
      <pre className="mx-auto w-11/12 md:w-9/12 text-[10px] text-gray-400 whitespace-pre-wrap break-all">
        params: {JSON.stringify(params)} searchParams:{" "}
        {JSON.stringify(searchParams)}
      </pre>
      <pre className="mx-auto w-11/12 md:w-9/12 text-[10px] text-gray-400 whitespace-pre-wrap break-all">
        headers: {JSON.stringify(debugHeaders)}
      </pre>
      <ItemsReview title={categoryId} items={items} />
      <Footer />
    </>
  );
}

async function getItems(categoryId: string) {
  if (!categoryId) {
    return [];
  }
  const db = (await import("../../../utils/db/webDB")).default;
  const { collection, getDocs, query, where } = await import(
    "firebase/firestore/lite"
  );
  const { app } = await import("../../../utils/db/webDB");
  const { getStorage } = await import("firebase/storage");
  const itemsColletion = collection(db, "articulos");
  const q = query(itemsColletion, where("categoria", "==", categoryId));
  const snapshot = await getDocs(q);
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
  const result: Item[] = await Promise.all(
    items.map(async (item) => {
      if (item.imageUrl !== "") {
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
        blur: item.blur,
      };
    })
  );
  const withPlaceHolder: Item[] = await Promise.all(
    result.map(async (item) => {
      if (item.blur !== "") {
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
        descripcion: item.descripcion,
        precio: item.precio,
      };
    })
  );
  return withPlaceHolder;
}

async function getUrlFromRef(
  storage: FirebaseStorage,
  image: string
): Promise<string> {
  const { ref, getDownloadURL } = await import("firebase/storage");
  const reference = ref(storage, image);
  return await getDownloadURL(reference);
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

function decodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}
