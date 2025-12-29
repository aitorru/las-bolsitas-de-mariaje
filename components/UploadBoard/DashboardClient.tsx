"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Carousel, Category, Highlight, Item } from "../../utils/types/types";

const UploadItem = dynamic(() => import("./UploadItem"));
const UploadCategory = dynamic(() => import("./UploadCategory"));
const ModifyItem = dynamic(() => import("./ModifyItem"));
const DeleteCategory = dynamic(() => import("./DeleteCategory"));
const EditHighLight = dynamic(() => import("./EditHighlight"));
const ModifyCategory = dynamic(() => import("./ModifyCategory"));
const CarouselEdit = dynamic(() => import("./UpdatePromotions"));

interface Props {
  categories: Category[];
  items: Item[];
  highlights: Highlight[];
  carousel: Carousel[];
}

const DBoardClient: NextPage<Props> = ({
  categories,
  items,
  highlights,
  carousel,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [subirArticuloSelected, setSubirArticuloSelected] =
    useState<boolean>(true);
  const [modificarArticuloSelected, setmodificarArticuloSelected] =
    useState<boolean>(false);
  const [subirCategoriaSelected, setSubirCategoriaSelected] =
    useState<boolean>(false);
  const [modificarCategoria, setModificarCategoria] =
    useState<boolean>(false);
  const [borrarCategoria, setBorrarCategoria] = useState<boolean>(false);
  const [editarDestacados, setEditarDestacados] = useState(false);
  const [editarPromociones, setEditarPromociones] = useState(false);

  useEffect(() => {
    if (searchParams.size === 0) return;
    if (searchParams.has("ma")) {
      setmodificarArticuloSelected(true);
      setBorrarCategoria(false);
      setSubirArticuloSelected(false);
      setSubirCategoriaSelected(false);
      setModificarCategoria(false);
      setEditarDestacados(false);
      setEditarPromociones(false);
    } else if (searchParams.has("cc")) {
      setSubirCategoriaSelected(true);
      setBorrarCategoria(false);
      setSubirArticuloSelected(false);
      setmodificarArticuloSelected(false);
      setModificarCategoria(false);
      setEditarDestacados(false);
      setEditarPromociones(false);
    } else if (searchParams.has("mc")) {
      setModificarCategoria(true);
      setBorrarCategoria(false);
      setSubirArticuloSelected(false);
      setSubirCategoriaSelected(false);
      setmodificarArticuloSelected(false);
      setEditarDestacados(false);
      setEditarPromociones(false);
    } else if (searchParams.has("bc")) {
      setBorrarCategoria(true);
      setModificarCategoria(false);
      setSubirArticuloSelected(false);
      setSubirCategoriaSelected(false);
      setmodificarArticuloSelected(false);
      setEditarDestacados(false);
      setEditarPromociones(false);
    } else if (searchParams.has("eh")) {
      setEditarDestacados(true);
      setBorrarCategoria(false);
      setModificarCategoria(false);
      setSubirArticuloSelected(false);
      setSubirCategoriaSelected(false);
      setmodificarArticuloSelected(false);
      setEditarPromociones(false);
    } else if (searchParams.has("up")) {
      setEditarPromociones(true);
      setEditarDestacados(false);
      setBorrarCategoria(false);
      setModificarCategoria(false);
      setSubirArticuloSelected(false);
      setSubirCategoriaSelected(false);
      setmodificarArticuloSelected(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen min-w-max max-w-[100vw] flex flex-col justify-start">
      <div className="flex flex-row m-5 shadow bg-blue-700/50 shadow-blue-700/50 rounded-2xl">
        <PageSelector
          name="Subir articulo"
          selected={subirArticuloSelected}
          onClick={() => {
            setSubirArticuloSelected(true);
            setSubirCategoriaSelected(false);
            setmodificarArticuloSelected(false);
            setEditarDestacados(false);
            setEditarPromociones(false);
            setModificarCategoria(false);
            setBorrarCategoria(false);
            router.push("/dboard");
          }}
        />
        <PageSelector
          name="Modificar articulo"
          selected={modificarArticuloSelected}
          onClick={() => {
            setmodificarArticuloSelected(true);
            setSubirArticuloSelected(false);
            setSubirCategoriaSelected(false);
            setBorrarCategoria(false);
            setEditarPromociones(false);
            setEditarDestacados(false);
            setModificarCategoria(false);
            router.push("/dboard?ma");
          }}
        />
        <PageSelector
          name="Crear categoria"
          selected={subirCategoriaSelected}
          onClick={() => {
            setSubirCategoriaSelected(true);
            setSubirArticuloSelected(false);
            setmodificarArticuloSelected(false);
            setEditarPromociones(false);
            setEditarDestacados(false);
            setBorrarCategoria(false);
            setModificarCategoria(false);
            router.push("/dboard?cc");
          }}
        />
        <PageSelector
          name="Modificar categoria"
          selected={modificarCategoria}
          onClick={() => {
            setModificarCategoria(true);
            setSubirArticuloSelected(false);
            setSubirCategoriaSelected(false);
            setEditarDestacados(false);
            setEditarPromociones(false);
            setBorrarCategoria(false);
            setmodificarArticuloSelected(false);
            router.push("/dboard?mc");
          }}
        />
        <PageSelector
          name="Borrar categoria"
          selected={borrarCategoria}
          onClick={() => {
            setBorrarCategoria(true);
            setEditarPromociones(false);
            setEditarDestacados(false);
            setModificarCategoria(false);
            setSubirArticuloSelected(false);
            setSubirCategoriaSelected(false);
            setmodificarArticuloSelected(false);
            router.push("/dboard?bc");
          }}
        />
        <PageSelector
          name="Editar Destacados"
          selected={editarDestacados}
          onClick={() => {
            setEditarDestacados(true);
            setEditarPromociones(false);
            setBorrarCategoria(false);
            setModificarCategoria(false);
            setSubirArticuloSelected(false);
            setSubirCategoriaSelected(false);
            setmodificarArticuloSelected(false);
            router.push("/dboard?eh");
          }}
        />
        <PageSelector
          name="Editar Promociones"
          selected={editarPromociones}
          onClick={() => {
            setEditarPromociones(true);
            setEditarDestacados(false);
            setBorrarCategoria(false);
            setModificarCategoria(false);
            setSubirArticuloSelected(false);
            setSubirCategoriaSelected(false);
            setmodificarArticuloSelected(false);
            router.push("/dboard?up");
          }}
        />
      </div>
      {subirArticuloSelected && <UploadItem categories={categories} />}
      {modificarArticuloSelected && (
        <ModifyItem categories={categories} items={items} />
      )}
      {subirCategoriaSelected && <UploadCategory />}
      {modificarCategoria && (
        <ModifyCategory items={items} categories={categories} />
      )}
      {borrarCategoria && <DeleteCategory items={items} categories={categories} />}
      {editarDestacados && (
        <EditHighLight highlights={highlights} items={items} />
      )}
      {editarPromociones && <CarouselEdit carousel={carousel} />}
    </div>
  );
};

interface PropsPageSelector {
  name: string;
  selected: boolean;
  onClick?: () => void;
}

const PageSelector: NextPage<PropsPageSelector> = ({
  name,
  selected,
  onClick,
}) => {
  if (selected) {
    return (
      <h1 className="p-3 m-2 text-white bg-blue-600 shadow-lg shadow-blue-600/50 rounded-xl">
        {name}
      </h1>
    );
  }
  return (
    <h1
      className="p-3 m-2 text-white bg-blue-300 cursor-pointer shadow-sm shadow-blue-300/50 rounded-xl"
      onClick={onClick}
    >
      {name}
    </h1>
  );
};

export default DBoardClient;
