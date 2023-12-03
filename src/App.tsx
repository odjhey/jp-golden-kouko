import { useState } from 'react'
import './App.css'
import { useForm } from 'react-hook-form'

type Sub = {
  num: number
  time: string
  values: string[]
}
type Subs = Sub[]

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
}

function App() {
  const { handleSubmit, register } = useForm<{ files: File[] }>()

  const [subs, setSubs] = useState<Subs>([])

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (d) => {
          console.log('---', { d })
          const rawSubs = await d.files[0].text()
          console.log(groupChunk(rawSubs))
        })}
      >
        <input type="file" className="input" {...register('files')}></input>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      <div>
        Subs
        {subs.map((sub) => {
          return <div></div>
        })}
      </div>
    </div>
  )
}

export default App
