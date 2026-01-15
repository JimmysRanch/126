import { motion } from 'framer-motion'

export function PuppyMascot() {
  return (
    <div className="flex items-center justify-center">
      <motion.img
        src="/mascot/puppy.png"
        alt="Scruffy Butts Puppy Mascot"
        className="w-[320px] select-none pointer-events-none drop-shadow-2xl"
        style={{ pointerEvents: 'none' }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 3, -3, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      />
    </div>
  )
}
