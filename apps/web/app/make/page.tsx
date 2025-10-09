"use client";

import BuilderDashboard from "@/src/components/builder/BuilderDashboard";
import BuilderNavbar from "@/src/components/nav/BuilderNavbar";

export default function Page() {
    return (
        <div className="h-screen w-screen relative overflow-hidden flex flex-col">
            <BuilderNavbar />
            <BuilderDashboard />
        </div>
    );
}
