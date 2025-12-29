import { FirebaseStorage } from "firebase/storage";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import FullItem from "../../../components/ItemsReview/FullItem";
import { Item } from "../../../utils/types/types";
import { getPlaiceholder } from "plaiceholder";

export const dynamic = "force-dynamic";

type Categories = {
  nombre: string;
};

type RouteParams = { id?: string };
type RouteSearch = { id?: string };

type Props = {
  params: RouteParams | Promise<RouteParams>;
  searchParams?: RouteSearch | Promise<RouteSearch>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const itemId = decodeParam(resolvedParams.id ?? "");
  return {
    title: itemId || "Producto",
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});
  const rawId = resolvedParams.id ?? resolvedSearch.id ?? "";
  const itemId = decodeParam(rawId);
  const requestHeaders = await headers();
  const debugHeaders = {
    "x-matched-path": requestHeaders.get("x-matched-path") ?? "",
    "x-nextjs-pathname": requestHeaders.get("x-nextjs-pathname") ?? "",
    "x-nextjs-page": requestHeaders.get("x-nextjs-page") ?? "",
    "x-invoke-path": requestHeaders.get("x-invoke-path") ?? "",
    "x-invoke-query": requestHeaders.get("x-invoke-query") ?? "",
    "x-url": requestHeaders.get("x-url") ?? "",
    "x-vercel-id": requestHeaders.get("x-vercel-id") ?? "",
  };
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
        debug: raw={String(rawId)} id={String(itemId)} item=
        {item ? "yes" : "no"} categories={categories.length}
      </div>
      <pre className="mx-auto w-11/12 md:w-9/12 text-[10px] text-gray-400 whitespace-pre-wrap break-all">
        params: {JSON.stringify(resolvedParams)} searchParams:{" "}
        {JSON.stringify(resolvedSearch)}
      </pre>
      <pre className="mx-auto w-11/12 md:w-9/12 text-[10px] text-gray-400 whitespace-pre-wrap break-all">
        headers: {JSON.stringify(debugHeaders)}
      </pre>
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
