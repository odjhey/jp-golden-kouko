import { useState } from 'react'
import './App.css'
import { useForm } from 'react-hook-form'

type Sub = {
  num: number
  time: string
  values: string[]
}
type Subs = Sub[]

type Tag = {
  num: number
  name: string
}

type Tags = Tag[]

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

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (d) => {
          console.log('---', { d })
          const rawSubs = await d.files[0].text()
          const grouped = groupChunk(rawSubs)
          console.log(grouped)

          setSubs(grouped)
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
        <div role="tabpanel" className="tab-content">
          {subs.map((sub) => {
            return (
              <div key={sub.num}>
                {sub.num} {sub.time} {sub.values.join('\n')}{' '}
                <button
                  type="button"
                  className="btn btn-xs btn-accent"
                  onClick={() => {
                    setTags((p) => [...p, { name: 'mine', num: sub.num }])
                  }}
                >
                  t
                </button>
                {tags
                  .filter((t) => t.num === sub.num)
                  .map((t) => (
                    <div key={`${t.name}+${t.num}`} className="badge">
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
        <div role="tabpanel" className="tab-content">
          {tags.map((t) => {
            const match = subs.find((s) => s.num === t.num)
            if (!match) return null
            return (
              <div key={`${t.name}+${t.num}`} className="badge">
                {match.num} {match.time} {match.values}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
