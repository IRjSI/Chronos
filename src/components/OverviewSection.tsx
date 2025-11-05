import type { IState } from "@/types";
import { motion } from "framer-motion";

interface Props {
  stats: IState[];
}

export function OverviewSection({ stats }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl bg-white p-5 shadow-sm" >
        <h2 className="text-sm font-medium text-slate-600 mb-4">Overview</h2>
        <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
            <div key={s._id} className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-lg font-semibold">
                    {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div> ))}
        </div>
    </motion.div>
  );
};