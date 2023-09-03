import * as React from 'react'
import CardFormBilikSuara from '../molecules/CardFormBilikSuara'
import { Tooltip } from '@mantine/core'
import { FiPlus } from 'react-icons/fi'

export default function BilikSuaraForm() {
  const [countBilik, setCountBilik] = React.useState(1)
  const MAX_COUNT_BILIK = 3

  const handleDeleteButton = () => {
    setCountBilik(countBilik - 1)
  }

  const formBilikSuara = Array.from({ length: countBilik }, (_, index) =>
    index + 1 === countBilik && index + 1 > 1 ? (
      <CardFormBilikSuara
        key={index + 1}
        number={index + 1}
        handleDeleteButton={handleDeleteButton}
      />
    ) : (
      <CardFormBilikSuara key={index + 1} number={index + 1} />
    )
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 border-b sticky top-14 bg-white z-30">
        <h1 className="text-one font-bold text-[20px]">Bilik Suara</h1>
      </div>
      {formBilikSuara}
      <Tooltip
        label={
          MAX_COUNT_BILIK === countBilik
            ? `Maaf maximal hanya ${MAX_COUNT_BILIK} Bilik Suara`
            : 'Tambah Bilik Suara'
        }
        withArrow
        position="bottom">
        <div
          className={`rounded-[10px] border border-dashed border-three p-[10px] flex items-center justify-center gap-4 transition-all duration-300 text-three ${
            MAX_COUNT_BILIK === countBilik
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md cursor-pointer'
          }`}
          onClick={() =>
            MAX_COUNT_BILIK === countBilik ? null : setCountBilik(countBilik + 1)
          }>
          <FiPlus size={30} />
        </div>
      </Tooltip>
    </div>
  )
}
