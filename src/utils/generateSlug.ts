import { customAlphabet } from 'nanoid'

export default function generateSlug() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nanoid = customAlphabet(alphabet, 9)
  return nanoid()
}
