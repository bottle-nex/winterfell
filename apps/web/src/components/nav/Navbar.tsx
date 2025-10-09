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
];

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 py-3 rounded-2xl shadow-lg z-[100] bg-[#141517] border-[1px] border-neutral-800 flex items-center justify-between">
      <div className="px-4 flex items-center justify-start">
        <LiaServicestack className="text-light/70 h-7 w-7" />
        <NavItems items={navItems}></NavItems>
      </div>
      <div className="flex items-center justify-center gap-x-2">
        <IoIosCreate
          onClick={() => router.push("/create")}
          className="hover:bg-neutral-700/70 rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
        />
        <NavbarSigninAction />
      </div>
    </div>
  );
}
