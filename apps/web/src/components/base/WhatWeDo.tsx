'use client';

export default function WhatWeDo() {
    return (
        <div className="h-screen w-screen flex flex-col p-15 text-[#FDF9F0] gap-y-5">
            <div className="h-full w-full bg-[#FDF9F0] rounded-3xl flex flex-col p-15">
                <div
                    className={`text-8xl text-[#141414] leading-[1.2] tracking-wide flex text-start font-bold`}
                >
                    Because blockchain shouldn’t require burnout.
                </div>
            </div>
        </div>
    );
}
