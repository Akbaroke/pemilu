export default function getPageUrl(slug: string, req: any) {
  const protocol = req.secure ? 'https' : 'http'
  const host = req.headers.host
  return `${protocol}://${host}/${slug}`
}
