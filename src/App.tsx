import { useState } from 'react'
import './App.css'
import { useForm } from 'react-hook-form'
import { SubLine } from './components/SubLine'
import { Subs, Tags } from './types/types'
import { useUi } from './hooks/use-ui'

const groupChunk = (text: string): Subs => {
  return text
    .replace(/\r\n/g, '\n') // normalize new lines
    .split(/\n\n+/) // Split input into blocks by empty lines
    .map((block) => {
      const blockLines = block.split('\n')
      const num = parseInt(blockLines[0], 10)
      const time = blockLines[1]
      const values = blockLines.slice(2)
      return { num, time, values }
    })
    .filter((b) => !isNaN(b.num))
}

function App() {
  const { handleSubmit, register } = useForm<{ files: File[] }>()

  const [subs, setSubs] = useState<Subs>([])
  const [tags, setTags] = useState<Tags>([])

  const { loading, ui } = useUi()

  if (loading) {
    return <div>...loading</div>
  }

  console.log('--ui', { ui })

  return (
    <div className="mt-1">
      <form
        onSubmit={handleSubmit(async (d) => {
          const rawSubs = await d.files[0].text()
          const grouped = groupChunk(rawSubs)

          setSubs(grouped)
          ui.addSub({ id: 'first', title: d.files[0].name, values: grouped })
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
                    setTags((p) => [...p, { name: 'mine', num: sub.num }])
                  }}
                >
                  t
                </button>
                <SubLine
                  num={sub.num}
                  time={sub.time}
                  content={sub.values.join('\n')}
                ></SubLine>
                {tags
                  .filter((t) => t.num === sub.num)
                  .map((t) => (
                    <div
                      key={`${t.name}+${t.num}`}
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
          {tags.map((t) => {
            const match = subs.find((s) => s.num === t.num)
            if (!match) return null
            return (
              <div key={`${t.name}+${t.num}`}>
                <SubLine
                  num={match.num}
                  time={match.time}
                  content={match.values.join('\n')}
                ></SubLine>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
