import Image from "next/image";
export default function Home() {
  return (
    <div className="text-5xl font-bold bg-white text-black m-2 p-2">
      <Image src="/logo.png" width={100} height={100} alt="logo"/>
      <div>Turant</div>
      
    </div>
  );
}
