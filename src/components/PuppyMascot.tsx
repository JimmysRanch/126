export function PuppyMascot() {
  return (
    <div className="flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-[320px] select-none pointer-events-none"
        style={{ pointerEvents: 'none' }}
      >
        <source src="/mascot/puppy-loop.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
