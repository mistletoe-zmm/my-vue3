function deepClone(obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (hash.has(obj)) {
    return hash.get(obj)
  }
  const cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}
