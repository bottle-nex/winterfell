import { GiEmptyHourglass } from 'react-icons/gi';
import { LiaServicestack } from 'react-icons/lia';
import { FaBolt, FaShieldAlt } from 'react-icons/fa';
import { FaRust } from 'react-icons/fa6';
import { TbAnchor } from 'react-icons/tb';
import {
    RiBox3Fill,
    RiCodeSSlashFill,
    RiFlightLandFill,
    RiShieldFill,
    RiTerminalBoxFill,
} from 'react-icons/ri';
import SafariBrowser from '../../ui/SafariBrowser';
import Image from 'next/image';

export default function BentoGrid() {
    return (
        <div className="w-full min-h-screen px-4 py-8 sm:px-6 lg:p-0">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-fr">
                <div className="sm:col-span-2 lg:col-span-4 lg:row-span-2 rounded-md bg-primary hover:scale-[1.02] transition-transform relative group flex flex-col p-6 min-h-[300px] lg:min-h-[400px]">
                    <div className="flex flex-col z-10">
                        <div className="font-bold w-full flex justify-start text-xl sm:text-2xl">
                            Winterfell Runtime
                        </div>
                        <div className="text-sm sm:text-base font-semibold flex justify-start tracking-wide text-white/80">
                            From code to chain in minutes
                        </div>
                    </div>
                    <div className="h-full w-full absolute flex justify-center top-1/3 left-0 right-0 pointer-events-none">
                        {/* <Image
                            src={'/images/docs/team.svg'}
                            alt="k8s-img"
                            className="object-contain max-h-[150px] sm:max-h-[200px]"
                        /> */}
                    </div>
                    <div className="h-full flex items-end justify-center gap-x-2 mt-auto z-10">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform duration-300">
                                The best way
                            </div>
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
                                style={{
                                    backgroundColor: 'rgba(150, 121, 255, 0.3)',
                                }}
                            >
                                <GiEmptyHourglass className="text-white/80 text-3xl sm:text-4xl group-hover:-rotate-9 rotate-9 transition-transform ease-in-out duration-200" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-2/3 -left-2 sm:-left-3 lg:-left-5 flex items-center gap-x-2 sm:gap-x-3 lg:gap-x-4 bg-white w-fit px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-sm shadow-lg">
                        <LiaServicestack className="text-[#9679ff] text-xl sm:text-2xl lg:text-3xl hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaBolt className="text-[#ffc400] text-lg sm:text-xl lg:text-2xl hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaShieldAlt className="text-[#00C6A7] text-lg sm:text-xl lg:text-2xl hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaRust className="text-[#CE422B] text-lg sm:text-xl lg:text-2xl hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <TbAnchor className="text-[#00C6A7] text-lg sm:text-xl lg:text-2xl hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                    </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-8 lg:row-span-1 bg-dark rounded-md relative overflow-hidden p-4 sm:p-6 group hover:scale-[1.02] transition-transform min-h-[200px]">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiShieldFill
                            size={20}
                            className="sm:w-6 sm:h-6"
                            style={{ color: '#9679ffea' }}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <h3
                            className={`font-semibold mb-2 text-xl sm:text-2xl`}
                            style={{ color: '#fdf9f0' }}
                        >
                            Isolated Execution
                        </h3>
                        <p
                            className={`leading-relaxed text-sm sm:text-[15px]`}
                            style={{
                                color: 'rgba(253, 249, 240, 0.75)',
                                opacity: 1,
                            }}
                        >
                            Each workspace runs in its own container. Your contracts are compiled
                            and tested in a secure environment with zero interference.
                        </p>
                    </div>
                </div>

                <div className="sm:col-span-1 lg:col-span-4 lg:row-span-1 bg-light/90 rounded-md p-4 sm:p-6 hover:scale-[1.02] transition-transform group min-h-[200px]">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiFlightLandFill
                            size={20}
                            className="sm:w-6 sm:h-6"
                            style={{ color: '#9679ffea' }}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className={`font-semibold mb-2 text-lg sm:text-xl text-dark`}>
                            Real-time Builds
                        </h3>
                        <p
                            className={`leading-relaxed text-sm sm:text-[15px] text-neutral-700`}
                            style={{
                                opacity: 1,
                            }}
                        >
                            Watch your Rust code compile as you type. No waiting, no context
                            switching.
                        </p>
                    </div>
                </div>

                <div className="sm:col-span-1 lg:col-span-4 lg:row-span-1 bg-dark rounded-md relative overflow-hidden p-4 sm:p-6 group hover:scale-[1.02] transition-transform min-h-[200px]">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiCodeSSlashFill className="text-primary-light text-xl sm:text-2xl" />
                    </div>

                    <div
                        className={`font-semibold mb-2 text-lg sm:text-xl text-white/90 flex justify-start w-full`}
                    >
                        Native Anchor
                    </div>

                    <div className="absolute w-[80%] h-35 group-hover:scale-105 transition-all transform duration-300 shadow-md group-hover:shadow-2xl -bottom-5 left-[10%] rounded-lg border-2 border-neutral-700 overflow-hidden bg-gray-950">
                        <div className="h-3 sm:h-4 bg-neutral-700 flex items-center px-1.5 sm:px-2 gap-x-1 relative">
                            <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 bg-[#E9524A] rounded-full" />
                            <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 bg-[#59C837] rounded-full" />
                            <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 bg-[#F1AE1B] rounded-full" />

                            <div className="text-[6px] sm:text-[8px] text-white/60 absolute right-2 sm:right-4 top-[1px] sm:top-[1.5px] tracking-wider">
                                ~:winter shell
                            </div>
                        </div>
                        <div className="text-[6px] sm:text-[8px] text-white/60 absolute left-1.5 sm:left-2 top-4 sm:top-5 tracking-wider flex gap-x-1">
                            <span className="text-[#ff2c21]">{'->'}</span>{' '}
                            <span className="text-cyan-500 font-semibold">~</span>
                            <span className="text-green-600 text-[6px] sm:text-[7px]">
                                welcome to winterfell <span className="animate-pulse">_</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-8 lg:row-span-1 bg-dark rounded-md relative overflow-hidden p-4 sm:p-6 flex flex-col lg:flex-row justify-between hover:scale-[1.02] transition-transform group min-h-[250px]">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiTerminalBoxFill
                            size={20}
                            className="sm:w-6 sm:h-6"
                            style={{ color: '#9679ffea' }}
                        />
                    </div>
                    <div className="flex-1 text-left lg:text-right lg:pl-6">
                        <h3 className={`font-semibold text-xl sm:text-2xl text-white/90`}>
                            Built-in Terminal
                        </h3>
                        <p
                            className={`leading-relaxed text-sm sm:text-[15px]`}
                            style={{
                                color: 'rgba(253, 249, 240, 0.75)',
                                opacity: 1,
                            }}
                        >
                            Run anchor commands directly through winter shell
                        </p>
                    </div>

                    <div className="absolute w-[90%] -bottom-20 sm:-bottom-24 lg:-bottom-36 -right-4 lg:-right-10">
                        <div className="group-hover:scale-[1.02] transition-transform duration-300 shadow-md group-hover:shadow-2xl rounded-lg overflow-hidden">
                            <SafariBrowser
                                imageSrc="/images/winterfell-playground.png"
                                className=""
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 lg:row-span-1 bg-dark rounded-md p-4 sm:p-6 group hover:scale-[1.02] transition-transform min-h-[200px]">
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiBox3Fill
                            size={20}
                            className="sm:w-6 sm:h-6"
                            style={{ color: '#9679ffea' }}
                        />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className={`font-semibold mb-2 text-lg sm:text-xl text-white/90`}>
                            Pre-loaded
                        </h3>
                        <p
                            className={`leading-relaxed text-sm sm:text-[15px] text-white/70`}
                            style={{
                                opacity: 1,
                            }}
                        >
                            Cargo, rustc, Anchor CLI—all ready when you are.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
