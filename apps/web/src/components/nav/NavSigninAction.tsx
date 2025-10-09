"use client";
import { MdChevronRight } from "react-icons/md";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { useState } from "react";
import LoginModal from "../utility/LoginModal";

export default function NavbarSigninAction() {
  const { session } = useUserSessionStore();
  const router = useRouter();
  const [opensignInModal, setOpenSignInModal] = useState<boolean>(false);

  function handler() {
    if (!session?.user || !session?.user.token) {
      setOpenSignInModal(true);
    } else {
      router.push('/home');
    }
  }

  return (
    <div className="">
      {!session?.user ? (
        <Button
          onClick={handler}
          className={cn(
            "text-[13px] font-semibold tracking-wide flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer z-[10] pr-1 rounded-lg",
            "bg-primary",
          )}
        >
          <span>Sign in</span>
          <MdChevronRight className="text-light" />
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-x-3 hover:bg-neutral-700/70 py-1.5 px-3 rounded-lg cursor-pointer select-none">
          {session?.user.image && (
            <Image
              src={session?.user.image}
              alt="user"
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <span className="text-light text-sm tracking-wider font-semibold">
            {`${session?.user?.name?.split(" ")[0]}'s Cantabil`}
          </span>
        </div>
      )}
      <LoginModal opensignInModal={opensignInModal} setOpenSignInModal={setOpenSignInModal} />
    </div>
  );
}
