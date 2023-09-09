import * as React from 'react'
import { Checkbox } from '@mantine/core'

export default function RadioCheck({ isActive }: { isActive: boolean }) {
  return <Checkbox checked={isActive} radius="xl" color="green" onChange={() => null} />
}
