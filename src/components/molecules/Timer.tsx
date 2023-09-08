import * as React from 'react'

type Props = {
  className?: string
}

const Timer = ({ className }: Props) => {
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <h1 className={className}>{formatTime(time)}</h1>
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}:${remainingSeconds}`
}

export default Timer
