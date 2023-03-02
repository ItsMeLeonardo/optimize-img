import JSZip from 'jszip'

import { saveAs } from 'file-saver'

export async function downloadManyImagesFromUrl(urls: string[] = []) {
  let zip = new JSZip()

  const promises = urls.map(async url => {
    return fetch(url).then(async response => {
      const blob = await response.blob()
      const format = response.headers.get('content-type')

      const nameWithExtencion = response.url.split('/').pop()
      const name = nameWithExtencion.split('.').shift()

      return {
        blob,
        name,
        format,
        extention: format.split('/').pop(),
      }
    })
  })

  const blobs = await Promise.all(promises)

  const files = blobs.map(({ blob, extention, name }) => {
    return new File([blob], `${name}.${extention}`)
  })

  let img = zip.folder('images')

  files.forEach(file => {
    img.file(file.name, file, { binary: true })
  })
  const content = await zip.generateAsync({ type: 'blob' })

  saveAs(content, 'optimized.zip')
}
