import { CloudinaryImage } from '@cloudinary/url-gen'

export function getOptimizedRemoteUrl(url: string) {
  const image = new CloudinaryImage(url, {
    cloudName: 'leonardoblog',
  }).setDeliveryType('fetch')

  return image.format('webp').toURL()
}
