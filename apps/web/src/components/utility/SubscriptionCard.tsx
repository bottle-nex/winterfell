import { LiaServicestack } from "react-icons/lia";


export default function SubscriptionCard() {
    return (
        <div className="h-72 w-[450px] bg-amber-500 border-white rounded-xl relative px-5 py-3 flex flex-col justify-between ">
            <div className="text-[25px] text-amber-700 font-extrabold tracking-[0.1em] flex justify-end items-center">
                Premium+
            </div>
            <div>
                <div>

                </div>
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center gap-x-2">
                        <div className="flex flex-col text-[8px] font-semibold">
                            <div>EXP</div>
                            <div>END</div>
                        </div>
                        <div className="text-xl">
                            {new Date().getMonth() + "/" + new Date().getFullYear().toString().substring(2)}
                        </div>
                    </div>
                    <LiaServicestack className="text-primary size-14 transition-all duration-500" />
                </div>
            </div>
        </div>
    )
}