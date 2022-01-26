import type { NextPage } from "next";
import Image from "next/image";
import Puesto from "../public/puesto.jpg";

const Home: NextPage = () => {
  return (
    <div
      className="h-full flex flex-grow bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("${Puesto.src}")`,
      }}>
      <div className="h-full container mx-auto grid grid-flow-col md:grid-cols-2 items-center content-center my-auto">
        <h1 className="text-7xl font-bold flex-auto self-center justify-items-center">
          Las Bolsitas de Mariaje
        </h1>
        <div className="skew-y-3">
          <Image
            alt="Puesto en un mercadillo"
            src={Puesto}
            layout={"intrinsic"}
            placeholder={"blur"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
