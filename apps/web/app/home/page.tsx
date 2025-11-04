import ContractTemplates from '@/src/components/home/ContractTemplates';
import MostRecentTemplates from '@/src/components/home/MostRecentTemplates';
import UserContracts from '@/src/components/home/UserContracts';
import HomeNavbar from '@/src/components/nav/HomeNavbar';

export default function Home() {
    return (
        <div className="bg-dark-base w-screen h-screen flex flex-col">
            <HomeNavbar />

            <div className="flex-1 grid grid-rows-[26%_35%_1%_35%] w-full max-w-[70%] mx-auto mt-10 gap-y-2">
                <UserContracts />
                <ContractTemplates />
                <div className="border-t-[1px] border-neutral-700/60" />
                <MostRecentTemplates />
            </div>
        </div>
    );
}
