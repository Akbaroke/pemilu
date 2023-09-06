import { OptionType, QueueType, RoomType } from '@/types/pemilu'

export interface PemiluDatas {
  emailUserCreated: string
  slug: string
  name: string
  maxQueue: number
  started_at: Date
  ended_at: Date
  options: OptionType[]
  rooms: RoomType[]
  queue?: QueueType[]
}
