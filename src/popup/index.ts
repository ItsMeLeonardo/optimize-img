import '../app.css'

import Popup from '../components/Popup.svelte'

const root = document.getElementById('root')

async function render() {
  new Popup({ target: root })
}

document.addEventListener('DOMContentLoaded', render)
