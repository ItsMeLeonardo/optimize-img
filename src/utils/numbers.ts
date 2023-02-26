export function getPercentageRatio(value: number, min: number, max: number): number {
  const percentage = ((value - min) / (max - min)) * 100
  return Math.round(percentage)
}

export function bytesFormatter(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(2)} MB`
  return `${(bytes / 1_073_741_824).toFixed(2)} GB`
}
