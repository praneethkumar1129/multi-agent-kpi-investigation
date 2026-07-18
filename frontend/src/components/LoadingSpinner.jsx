export default function LoadingSpinner({ size = 32 }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
