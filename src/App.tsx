import './App.css'
import { useForm } from 'react-hook-form'
import { SubLine } from './components/SubLine'
import { useUi } from './hooks/use-ui'
import { Subs } from './types/types'
import { observer } from 'mobx-react'

const groupChunk = (text: string): Subs => {
  return text
    .replace(/\r\n/g, '\n') // normalize new lines
    .split(/\n\n+/) // Split input into blocks by empty lines
    .map((block) => {
      const blockLines = block.split('\n')
      const num = parseInt(blockLines[0], 10)
      const time = blockLines[1]
      const contents = blockLines.slice(2)
      return { num, time, contents }
    })
    .filter((b) => !isNaN(b.num))
}

const App = observer(() => {
  const { handleSubmit, register } = useForm<{ files: File[] }>()

  const { loading, ui } = useUi()

  if (loading) {
    return <div>...loading</div>
  }

  return (
    <div className="mt-1">
      <form
        onSubmit={handleSubmit(async (d) => {
          const rawSubs = await d.files[0].text()
          const grouped = groupChunk(rawSubs)

          ui.addSub({
            id: 'first',
            title: d.files[0].name,
            subEntries: grouped,
          })
        })}
      >
        <input type="file" className="input" {...register('files')}></input>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="subs"
          role="tab"
          className="tab"
          aria-label="subs"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-2">
          {ui.subs().map((sub) => {
            return (
              <div key={sub.num} className="flex gap-2 items-center">
                <button
                  type="button"
                  className="btn btn-xs btn-primary"
                  onClick={() => {
                    ui.mine({
                      num: sub.num,
                      time: sub.time,
                      contents: sub.contents.map((v) => v),
                    })
                  }}
                >
                  t
                </button>
                <SubLine
                  num={sub.num}
                  time={sub.time}
                  content={sub.contents.join('\n')}
                ></SubLine>
                {sub.tags.map((t) => (
                  <div
                    key={`${t.name}+${sub.num}`}
                    className="badge badge-accent"
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <input
          type="radio"
          name="subs"
          role="tab"
          className="tab"
          aria-label="mined"
        />
        <div role="tabpanel" className="tab-content p-2">
          {ui.tags().map((t) => {
            return (
              <div key={`${t.name}+${t.num}`}>
                <SubLine
                  num={t.num}
                  time={t.time}
                  content={t.contents.join('\n')}
                ></SubLine>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default App
