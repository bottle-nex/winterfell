import Navbar from "@/src/components/nav/Navbar";
import Image from "next/image";

export default function Page() {
    return (
        <div className="h-screen w-screen relative overflow-hidden flex flex-col">
            <Navbar />
            <Image src="/images/base.png" alt="logo" fill className="" />
        </div>
    );
}