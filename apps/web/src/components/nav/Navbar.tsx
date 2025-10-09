'use client'
import { LiaServicestack } from "react-icons/lia";
import { IoIosCreate } from "react-icons/io";
import { useRouter } from "next/navigation";
import NavItems from "./NavItems";
import NavbarSigninAction from "./NavSigninAction";

const navItems = [
  {
    name: "Features",
    link: "#features",
  },
  {
    name: "Pricing",
    link: "#pricing",
  },
  {
    name: "Contact",
    link: "#contact",
  },
  {
    name: "About",
    link: "#about"
  },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="w-full z-[100] flex items-center justify-between gap-x-6 px-5">
      <div className="flex items-center gap-x-2">
        <LiaServicestack className="text-light/70 h-10 w-10" />
      </div>
      
      <div className="flex-1 max-w-fit">
        <div className="w-full py-1 px-4 rounded-full shadow-lg bg-[#262626] border border-neutral-800 flex items-center justify-around">
          <NavItems items={navItems} />
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <IoIosCreate
          onClick={() => router.push("/make")}
          className="hover:bg-neutral-700/70 rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
        />
        <NavbarSigninAction />
      </div>
    </div>
  );
}

