import { Checkbox } from '@mantine/core'
import * as React from 'react'

export default function RadioCheck({ isActive }: { isActive: boolean }) {
  return <Checkbox checked={isActive} radius="xl" color="green" />
}
