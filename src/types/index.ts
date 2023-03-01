export type ImageFormat = 'png' | 'jpg' | 'webp'

export type Colors = 'primary' | 'secondary' | 'tertiary' | 'neutral'

export type ResizeType = 'PERCETAGE' | 'PIXELS' | 'RENDERED'

export type Performance = 'low' | 'medium' | 'high'

export type Coordinates = {
  top: number
  left: number
  bottom: number
  right: number
}

export type DomImages = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  originalWidth: number
  originalHeight: number
  coordinates: Coordinates
}

export type OptimizeOptions = {
  format: ImageFormat
  quality: number
  percentageResize?: number
  resizeType?: ResizeType
  newWidth?: number
  newHeight?: number
}

export type CustomImage = {
  size: number
  optimizeOptions?: OptimizeOptions
  performance: Performance
  sizeLabel: string
} & DomImages
