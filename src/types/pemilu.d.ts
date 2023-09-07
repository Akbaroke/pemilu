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

export type FormDetailState = {
  name: string
  maxQueue: number
  started_at: number
  ended_at: number
  isValid?: boolean
}

export type FormKandidatState = {
  id: string
  name: string
  image: Image
  color: string
  isValid: boolean
}

export type Image = {
  url: string
  file: FileWithPath
}

export type FormBilikSuaraState = {
  id: string
  prepare: number
  timer: number
  isValid: boolean
}