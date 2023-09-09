import { OptionType, VotersType } from '@/types/pemilu'

export interface PemiluDatas {
  emailUserCreated: string
  slug: string
  name: string
  maxVoters: number
  started_at: number
  ended_at: number
  options: OptionType[]
}
