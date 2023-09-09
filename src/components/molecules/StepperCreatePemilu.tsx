import * as React from 'react'
import { Stepper, StepperProps, rem } from '@mantine/core'
import { FaUserTie } from 'react-icons/fa'
import { PiNotepadBold } from 'react-icons/pi'
import { HiEye } from 'react-icons/hi'

type Props = {
  active: number
  setActive: (number: number) => void
}

export default function StepperCreatePemilu({ active, setActive }: Props) {
  return (
    <div>
      <StyledStepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        color="#222121">
        <Stepper.Step icon={<PiNotepadBold size="1.1rem" />} />
        <Stepper.Step icon={<FaUserTie size="1.1rem" />} />
        <Stepper.Step icon={<HiEye size="1.1rem" />} />
      </StyledStepper>
    </div>
  )
}

function StyledStepper(props: StepperProps) {
  return (
    <Stepper
      styles={{
        stepBody: {
          display: 'none',
        },

        step: {
          padding: 0,
        },

        stepIcon: {
          borderWidth: rem(4),
        },

        separator: {
          marginLeft: rem(-2),
          marginRight: rem(-2),
          height: rem(10),
        },
      }}
      {...props}
    />
  )
}
