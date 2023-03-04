import type { OptimizeResult } from 'src/types'
import { bytesFormatter, getImagePerformance } from '.'

export async function getRemoteImageSize(src: string): Promise<OptimizeResult> {
  const response = await fetch(src)
  const contentLenght = response.headers.get('content-length')
  const bytes = Number(contentLenght)
  const sizeLabel = bytesFormatter(bytes)

  const performance = getImagePerformance(bytes)

  return {
    sizeLabel,
    performance,
    bytes,
    url: src,
  }
}
