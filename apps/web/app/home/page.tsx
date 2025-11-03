import UserContracts from "@/src/components/home/UserContracts";
import HomeNavbar from "@/src/components/nav/HomeNavbar";

export default function Home (){
    return (
        <div className="bg-dark-base w-screen h-screen flex flex-col">
            <HomeNavbar/>

            <div className="flex-1 grid grid-rows-[28%_36%_36%] w-full max-w-[70%] mx-auto mt-10 space-y-7">
                <UserContracts/>
                {/* <UserContracts/>
                <UserContracts/> */}

            </div>
        </div>
    )
}