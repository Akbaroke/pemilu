export type OptionType = {
  id: string
  name: string
  imageUrl: string
  color: string
  votes?: VoteType[]
}

export type VoteType = {
  id: string
  name: string
}

export type RoomType = {
  id: string
  prepare: number
  timer: number
  userActive?: UserActiveType
}

export type QueueType = {
  id: string
  name: string
}

export type UserActiveType = {
  id: string
  name: string
  joining_at: Date
}
