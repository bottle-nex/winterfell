import SafariBrowser from '../../ui/SafariBrowser';
import { GiEmptyHourglass } from 'react-icons/gi';
import { LiaServicestack } from 'react-icons/lia';
import { FaBolt, FaShieldAlt } from 'react-icons/fa';
import { FaRust } from 'react-icons/fa6';
import { TbAnchor } from 'react-icons/tb';
import Image from 'next/image';
import {
    RiBox3Fill,
    RiCodeSSlashFill,
    RiFlightLandFill,
    RiShieldFill,
    RiTerminalBoxFill,
} from 'react-icons/ri';

export default function BentoGrid() {
    return (
        <div className="w-full h-[85vh] grid grid-rows-[60%_40%] gap-3 pr-2">
            <div className="grid grid-cols-[35%_65%] gap-4">
                <div className="rounded-md bg-primary/90 hover:scale-102 transition-transform relative group flex flex-col ">
                    <div className="flex flex-col">
                        <div className="font-bold w-full flex justify-start text-2xl px-5 pt-6">
                            Winterfell Runtime
                        </div>
                        <div className="text-base font-semibold flex justify-start px-5 tracking-wide text-light/80">
                            From code to chain in minutes
                        </div>
                    </div>
                    <div className="h-full w-full absolute flex justify-center -top-13">
                        <Image
                            src={'/images/docs/team.svg'}
                            fill
                            alt="k8s-img"
                            className="object-contain"
                        />
                    </div>
                    {/* <div className="flex items-end w-full text-left text-black trackin-wide font-light">
                            A sandboxed development environment built for Anchor smart contracts.
                            Write, compile, test, and deploy—all in one place.
                        </div> */}
                    <div className="h-full flex items-end justify-center gap-x-2 p-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-xl group-hover:translate-x-1 transition-transform duration-300">
                                The best way
                            </div>
                            <div
                                className="w-12 h-12 rounded-[4px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
                                style={{
                                    backgroundColor: 'rgba(150, 121, 255, 0.3)',
                                }}
                            >
                                <GiEmptyHourglass className="text-light/90 size-10 group-hover:-rotate-9 rotate-9 transition-transform ease-in-out duration-200" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-2/3 -left-5 flex items-center gap-x-4.5 bg-light w-fit px-4 py-3 rounded-sm">
                        <LiaServicestack className="text-primary size-7 hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaBolt className="text-[#ffc400] size-6 pt-px hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaShieldAlt className="text-[#00C6A7] size-6 hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <FaRust className="text-[#CE422B] size-6.5 hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                        <TbAnchor className="text-[#00C6A7] size-6 hover:-translate-y-1 transition-transform ease-in-out duration-200" />
                    </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                    <div className="bg-dark rounded-md relative overflow-hidden p-6 group hover:scale-102 transition-transform ">
                        <div
                            className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                            style={{
                                backgroundColor: 'rgba(150, 121, 255, 0.15)',
                            }}
                        >
                            <RiShieldFill size={24} style={{ color: '#9679ffea' }} />
                        </div>
                        <div className="flex-1 text-left">
                            <h3
                                className={`font-semibold mb-2 text-2xl`}
                                style={{ color: '#fdf9f0' }}
                            >
                                Isolated Execution
                            </h3>
                            <p
                                className={`leading-relaxed text-[15px]`}
                                style={{
                                    color: 'rgba(253, 249, 240, 0.75)',
                                    opacity: 1,
                                }}
                            >
                                Each workspace runs in its own container. Your contracts are
                                compiled and tested in a secure environment with zero interference.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-light/90 rounded-md p-4 hover:scale-102 transition-transform group">
                            <div
                                className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shrink-0"
                                style={{
                                    backgroundColor: 'rgba(150, 121, 255, 0.15)',
                                }}
                            >
                                <RiFlightLandFill size={24} style={{ color: '#9679ffea' }} />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className={`font-semibold mb-2 text-xl text-dark`}>
                                    Real-time Builds
                                </h3>
                                <p
                                    className={`leading-relaxed text-[15px] text-neutral-700`}
                                    style={{
                                        opacity: 1,
                                    }}
                                >
                                    Watch your Rust code compile as you type. No waiting, no context
                                    switching.
                                </p>
                            </div>
                        </div>

                        <div className="bg-dark rounded-md relative overflow-hidden p-4 group hover:scale-102 transition-transform">
                            <div
                                className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shrink-0"
                                style={{
                                    backgroundColor: 'rgba(150, 121, 255, 0.15)',
                                }}
                            >
                                <RiCodeSSlashFill className="text-primary-light" />
                            </div>

                            <div
                                className={`font-semibold mb-2 text-xl text-light/90 flex justify-start w-full`}
                            >
                                Native Anchor
                            </div>

                            <div className="absolute w-full max-w-[80%] h-full group-hover:scale-105 transition-all transform duration-300 shadow-dark-base shadow-md group-hover:shadow-xl -bottom-28 left-1/10 rounded-lg border-2 border-neutral-700 overflow-hidden bg-dark-base">
                                <div className="h-4 bg-neutral-700 flex items-center px-2 gap-x-1 relative">
                                    <div className="h-1 w-1 bg-[#E9524A] rounded-full" />
                                    <div className="h-1 w-1 bg-[#59C837] rounded-full" />
                                    <div className="h-1 w-1 bg-[#F1AE1B] rounded-full" />

                                    <div className="h-1 w-fit rounded-full text-[6px] text-light/60 absolute right-20 top-1 tracking-wider">
                                        ~:winter shell
                                    </div>
                                </div>
                                <div className="h-1 w-fit rounded-full text-[6px] text-light/60 absolute left-1 top-5 tracking-wider flex gap-x-1">
                                    <span className="text-[#ff2c21]">{'->'}</span>{' '}
                                    <span className="text-cyan-500 font-semibold">~</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[68.5%_31.5%] gap-4">
                <div className="bg-dark rounded-md relative overflow-hidden p-6 flex justify-between hover:scale-102 transition-transform group">
                    <div
                        className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiTerminalBoxFill size={24} style={{ color: '#9679ffea' }} />
                    </div>
                    <div className="flex-1 text-end pl-6">
                        <h3 className={`font-semibold text-2xl text-light/90`}>
                            Built-in Terminal
                        </h3>
                        <p
                            className={`leading-relaxed text-[15px]`}
                            style={{
                                color: 'rgba(253, 249, 240, 0.75)',
                                opacity: 1,
                            }}
                        >
                            Run anchor commands directly through winter shell
                        </p>
                    </div>

                    <div className="absolute w-full max-w-[90%] -bottom-35 -right-10 ">
                        <SafariBrowser
                            className="group-hover:scale-102 transition-transform duration-300 shadow-md shadow-dark-base group-hover:shadow-2xl rounded-lg"
                            imageSrc="/images/winterfell-playground.png"
                        />
                    </div>
                </div>
                <div className="bg-dark rounded-md p-6 group hover:scale-102 transition-transform">
                    <div
                        className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: 'rgba(150, 121, 255, 0.15)',
                        }}
                    >
                        <RiBox3Fill size={24} style={{ color: '#9679ffea' }} />
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className={`font-semibold mb-2 text-xl text-light/90`}>Pre-loaded</h3>
                        <p
                            className={`leading-relaxed text-[15px] text-light/70`}
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
