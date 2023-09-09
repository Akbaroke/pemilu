import * as React from 'react'

function useCountdown(initialValue: number) {
  const [second, setSecond] = React.useState(initialValue)

  React.useEffect(() => {
    const countDown = setInterval(() => {
      setSecond(prevSecond => (prevSecond > 0 ? prevSecond - 1 : 0))
    }, 1000)

    return () => clearInterval(countDown)
  }, [])

  return { second, setSecond }
}

export default useCountdown
