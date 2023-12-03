export const SubLine = (props: {
  num: number
  time: string
  content: string
}) => {
  const { num, time, content } = props
  return (
    <div className="flex flex-row items-center gap-3 border border-solid px-1">
      <div className="text text-xs font-bold">{num}</div>
      <div className="flex-col gap-2">
        <div className="text text-xs text-slate-500">{time}</div>
        <div className="text text-lg">{content}</div>
      </div>
    </div>
  )
}
