import Image from "next/image";
import { motion } from 'framer-motion'
import { cn } from "@/src/lib/utils";
import { doto } from "../../base/FeatureOne";

export default function ClientE2B() {
    return (
        <div className="relative w-full px max-w-[80%] mx-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-44 relative flex items-center justify-center">
                <Image
                    src={'/images/e2b.png'}
                    fill
                    alt=""
                    className="rounded-[8px] overflow-hidden"
                />
                <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2}} className={cn(doto.className, "text-light font-bold text-6xl absolute")}>
                    Sandboxed Environment
                </motion.span>
            </motion.div>
        </div>
    )
}