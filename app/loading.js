export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white animate-pulse">B</div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay:'0ms'}}></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay:'150ms'}}></div>
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay:'300ms'}}></div>
        </div>
      </div>
    </div>
  )
}
