export function cloneObject(value) {
  return JSON.parse(JSON.stringify(value))
}

export function readFileAsText (file, cb) {
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    cb(reader.result)
  })
  reader.readAsText(file)
}
