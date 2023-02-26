export type ImageExtension = 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'

export type Colors = 'primary' | 'secondary' | 'tertiary' | 'neutral'

export type Coordinates = {
  top: number
  left: number
  bottom: number
  right: number
}

export type CustomImage = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  originalWidth: number
  originalHeight: number
  coordinates: Coordinates
}
