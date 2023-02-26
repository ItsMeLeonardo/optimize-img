export function paint() {
  document.querySelector('body').style.backgroundColor = 'blue'
}

export function getAllImages() {
  const images = document.querySelectorAll('img')
  return images
}
