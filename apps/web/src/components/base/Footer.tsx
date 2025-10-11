import { Bruno_Ace } from "next/font/google";

const bruno = Bruno_Ace({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

export default function Footer() {
    return (
        <div className="w-screen h-screen px-4 bg-black">
            <div className="h-[65%] w-full border-b border-neutral-700 pt-20 px-4 flex">
                <div className="w-[50%] h-full border-r border-neutral-700 text-neutral-100 ">
                    <div className="max-w-md text-5xl font-semibold tracking-wide">
                        Your lazy dev side just won.
                    </div>
                </div>

                <div className="w-[50%] h-full flex">

                    <div className="w-full h-full border-r border-neutral-700 px-4 flex flex-col text-neutral-200 gap-y-3">
                        <div className="text-3xl">
                            About
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <span>
                                What we do
                            </span>
                            <span>
                                Why us
                            </span>
                            <span>
                                Terms & Conditions
                            </span>
                            <span>
                                Privacy Policy
                            </span>
                        </div>
                    </div>

                    <div className="w-full h-full border-r border-neutral-700 px-4 flex flex-col text-neutral-200 gap-y-3">
                        <div className="text-3xl">
                            About
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <span>
                                What we do
                            </span>
                            <span>
                                Why us
                            </span>
                            <span>
                                Terms & Conditions
                            </span>
                            <span>
                                Privacy Policy
                            </span>
                        </div>
                    </div>


                    <div className="w-full h-full border-r border-neutral-700 px-4 flex flex-col text-neutral-200 gap-y-3">
                        <div className="text-3xl">
                            Socials
                        </div>

                        <div className="flex flex-col gap-y-1">
                            <span>
                                Twitter
                            </span>
                            <span>
                                GitHub
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`h-[35%] text-neutral-200 w-full flex justify-center items-center text-[220px] font-extrabold tracking-widest ${bruno.className}`}>
                S H A R K 
            </div>
        </div>
    )
}