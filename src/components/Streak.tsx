import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { useEffect, useState } from "react"
import { getStreak } from "@/api/streakApi";

export default function Streak() {
  const [streak, setStreak] = useState<number | null>(null);

  const updateStreak = async () => {
    const streak = await getStreak();
    setStreak(streak);
  }

  useEffect(() => {
    updateStreak();
  }, [])

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative flex items-center justify-center gap-1.5 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-sm font-medium shadow-sm cursor-default"
    >
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center"
      >
        <Flame className="w-4 h-4 text-orange-500" />
      </motion.div>

      <span>{streak}</span>

      <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-sm -z-10" />
    </motion.div>
  )
}
