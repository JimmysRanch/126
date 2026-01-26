<TabsContent value="d1" className="mt-0">
  <div className="relative min-h-[700px] rounded-3xl border border-slate-700/40 bg-black/80 p-4 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] [perspective:2800px] [transform-style:preserve-3d] overflow-hidden">
    <div
      className="relative mx-auto max-w-6xl"
      style={{
        transform: "rotateX(22deg) rotateY(-5deg) scale(1.06)",
        transformStyle: "preserve-3d",
      }}
    >
      {d1Rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="[transform-style:preserve-3d] mb-[-60px] last:mb-[-20px]"
          style={{
            transform: `rotateX(${16 + rowIdx * 9}deg) rotateY(${(rowIdx - 1.5) * 11}deg)`,
          }}
        >
          <div
            className={`grid gap-6 sm:gap-8 [transform-style:preserve-3d] justify-items-center ${
              row.count === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Array.from({ length: row.count }).map((_, colIdx) => {
              const center = (row.count - 1) / 2
              const offset = colIdx - center
              const z = row.depth + 100 - Math.abs(offset) * 70
              const rotY = offset * -22
              const rotX = 8 + Math.abs(offset) * 8 + rowIdx * 4
              const tx = offset * 35
              const ty = rowIdx * 24 + Math.abs(offset) * 16

              return (
                <div
                  key={colIdx}
                  className={`${row.height} w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-slate-900 via-black to-slate-950 border border-slate-600/50 shadow-[0_50px_120px_rgba(0,0,0,1),inset_0_2px_10px_rgba(255,255,255,0.03)] [transform-style:preserve-3d] transition-all duration-300 hover:scale-110 hover:z-20 hover:shadow-cyan-900/30`}
                  style={{
                    transform: `translate3d(${tx}px, ${ty}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
                  <div className="absolute inset-[1px] rounded-[15px] border border-cyan-900/30 opacity-70 pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
</TabsContent>
export { Staff }
