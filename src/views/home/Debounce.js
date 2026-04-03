/*
 * 防抖
 * */

/**
 * @param fn
 * @param delay
 */
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearInterval(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 *
 * @param fn
 * @param delay
 */
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const time = Date.now()
    if (time - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = time
    }
  }
}
