import { CloudinaryImage } from '@cloudinary/url-gen'
import { Resize } from '@cloudinary/url-gen/actions/resize'
import type { ImageFormat } from 'src/types'

export type OptimizeOptions = {
  url: string
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
}

export function buildOptimizeImageUrl(options: OptimizeOptions) {
  const { url, format = 'webp', height, quality = 70, width } = options

  const image = new CloudinaryImage(url, {
    cloudName: 'leonardoblog',
  }).setDeliveryType('fetch')

  image.quality(quality)

  if (width && height) {
    image.resize(Resize.scale().width(width).height(height))
  } else {
    if (width) {
      image.resize(Resize.scale().width(width))
    }
    if (height) {
      image.resize(Resize.scale().height(height))
    }
  }

  return image.format(format).toURL()
}
