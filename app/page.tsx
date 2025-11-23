import Image from "next/image";
import Nav1 from "./Components/Nav1";

export default function Home() {
  return (
    <div>
      <div className="relative w-full h-screen overflow-hidden">
        <video
          src="/back.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute object-contain -z-10"
        ></video>

        <div className="relative z-10 m-2 top-3 p-2">
          <Nav1 />
        </div>
        <div className="w-full text-center font-[family-name:var(--font-poppins)] font-bold text-5xl my-10 py-10">
          <div className="my-4 py-2">
            Khana, Gaadi, ya PG?
          </div>
          <div className="my-4 py-2">
            Bas Turant Karo
          </div>
        </div>

      </div>
      <div>
        <div className="bg-[#3269C3]">
          City Travel & Cabs
          <div>
            Shared cabs and autos
            Affordable rates
          </div>
        </div>
        <div className="bg-[#8E44AD]">
          PG & Hotels
          <div>
            Compare rents, see room photos,
            and chat with landlords directly
          </div>
        </div>
        <div className="bg-[#E67E22]">
          Restaurant
          <div>
            Browse daily menus from
            local dhabas and messes
          </div>
        </div>
        <div className="bg-[#2ECC71]">
          Grocery (Kirana)
          <div>
            Connect with nearby shops
            Send your list to check availability
          </div>
        </div>
        <div className="bg-[#009688]">
          Medical & Pharmacy
          <div>
            Upload prescription
            Fast home delivery.
          </div>
        </div>
      </div>


    </div>
  );
}
