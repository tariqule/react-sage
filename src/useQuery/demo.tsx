import * as React from 'react'

import { cache } from './cache'
import { useQuery } from '.'
import { sleep } from './utils'

export interface Resource {
  userId: number
  id: number
  title: string
  completed: boolean
}

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

export const client = {
  async getResource({ id }: { id: number }): Promise<Resource> {
    await sleep(500)
    return Promise.resolve({
      id,
      userId: Math.floor(Math.random() * 100),
      title: 'quis ut nam facilis et officia qui',
      completed: false
    })
  }
}

export const UseQueryDemo: React.FC = () => {
  const [id, setId] = React.useState(1)
  const [wait, setWait] = React.useState(true)

  const query = useQuery(client.getResource, {
    wait,
    args: { id },
    caching: { key: 'getResource', ttl: 10 }
  })

  React.useEffect(() => {
    window.setTimeout(() => setWait(false), 2000)
  }, [])

  return (
    <>
      <button disabled={query.loading} onClick={() => setId(getRandomInt(5))}>
        Refresh Query
      </button>
      {<pre>{query.loading ? 'Query loading...' : 'Query successful!'}</pre>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        <b>Response:</b> {JSON.stringify(query.result)}
      </pre>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        <b>Query Cache Order:</b> {JSON.stringify(cache.order)}
      </pre>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        <b>Query Cache:</b> {JSON.stringify(cache.cache)}
      </pre>
    </>
  )
}
