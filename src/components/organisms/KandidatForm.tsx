import React from 'react'
import { FiPlus } from 'react-icons/fi'
import CardFormKandidat from '../molecules/CardFormKandidat'
import { Tooltip } from '@mantine/core'

export default function KandidatForm() {
  const [countKandidat, setCountKandidat] = React.useState(2)
  const MAX_COUNT_KANDIDAT = 5

  const handleDeleteButton = () => {
    setCountKandidat(countKandidat - 1)
  }

  const formKandidatComponents = Array.from({ length: countKandidat }, (_, index) =>
    index + 1 === countKandidat && index + 1 > 2 ? (
      <CardFormKandidat
        key={index + 1}
        number={index + 1}
        handleDeleteButton={handleDeleteButton}
      />
    ) : (
      <CardFormKandidat key={index + 1} number={index + 1} />
    )
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 border-b sticky top-14 bg-white z-30">
        <h1 className="text-one font-bold text-[20px]">Daftar Kandidat</h1>
      </div>
      {formKandidatComponents}
      <Tooltip
        label={
          MAX_COUNT_KANDIDAT === countKandidat
            ? `Maaf maximal hanya ${MAX_COUNT_KANDIDAT} Kandidat`
            : 'Tambah Kandidat'
        }
        withArrow
        position="bottom">
        <div
          className={`rounded-[10px] border border-dashed border-three p-[10px] flex items-center justify-center gap-4 transition-all duration-300 text-three ${
            MAX_COUNT_KANDIDAT === countKandidat
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md cursor-pointer'
          }`}
          onClick={() =>
            MAX_COUNT_KANDIDAT === countKandidat
              ? null
              : setCountKandidat(countKandidat + 1)
          }>
          <FiPlus size={30} />
        </div>
      </Tooltip>
    </div>
  )
}
