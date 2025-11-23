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
      <div className="p-4 flex flex-col gap-10 items-center justify-center bg-[url('/back2.png')] bg-contain">
        <div className="bg-[#3269C3] p-4 flex justify-between w-9/10 mt-4 rounded-4xl">
          <div className="">
            <div className="font-[family-name:var(--font-poppins)] text-5xl text-white font-semibold m-4 p-4">
              City Travel & Cabs
            </div>
            <div className="font-[family-name:var(--font-noto-sans)] text-white text-5xl font-thin m-4 p-4">
              Shared cabs and autos
              Affordable rates
            </div>
          </div>
          <Image src="/car.gif" height={600} width={600} alt="car"></Image>
        </div>
        <div className="bg-[#8E44AD] p-4 flex justify-between w-9/10 rounded-4xl">
          <div>
            <div className="font-[family-name:var(--font-poppins)] text-5xl text-white font-semibold m-4 p-4">
              PG & Hotels
            </div>
            <div className="font-[family-name:var(--font-noto-sans)] text-white text-5xl font-thin m-4 p-4">
              Compare rents, see room photos,
              and chat with landlords directly
            </div>
          </div>
          <Image src="/PG.gif" height={800} width={900} alt="car"></Image>
        </div>
        <div className="bg-[#E67E22] p-4 flex justify-between w-9/10 rounded-4xl">
          <div>
            <div className="font-[family-name:var(--font-poppins)] text-5xl text-white font-semibold m-4 p-4">
              Restaurant
            </div>
            <div className="font-[family-name:var(--font-noto-sans)] text-white text-5xl font-thin m-4 p-4">
              Browse daily menus from
              local dhabas and messes
            </div>
          </div>
          <Image src="/restaurant.gif" height={400} width={400} alt="car"></Image>
        </div>
        <div className="bg-[#2ECC71] p-4 flex justify-between w-9/10 rounded-4xl">
          <div>
            <div className="font-[family-name:var(--font-poppins)] text-5xl text-white font-semibold m-4 p-4">
              Grocery (Kirana)
            </div>
            <div className="font-[family-name:var(--font-noto-sans)] text-white text-5xl font-thin m-4 p-4">
              Connect with nearby shops
              Send your list to check availability
            </div>
          </div>
          <Image src="/kirana.gif" height={292} width={535} alt="car"></Image>
        </div>
        <div className="bg-[#009688] p-4 flex justify-between w-9/10 rounded-4xl">
          <div>
            <div className="font-[family-name:var(--font-poppins)] text-5xl text-white font-semibold m-4 p-4">
              Medical & Pharmacy
            </div>
            <div className="font-[family-name:var(--font-noto-sans)] text-white text-5xl font-thin m-4 p-4">
              Upload prescription
              Fast home delivery.
            </div>
          </div>
          <Image src="/Pharmacy.gif" height={292} width={535} alt="car"></Image>
        </div>
      </div>


    </div>
  );
}
