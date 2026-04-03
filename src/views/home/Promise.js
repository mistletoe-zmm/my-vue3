// 定义状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(execute) {
    this.state = PENDING
    this.fulfilledFnList = []
    this.rejectedFnList = []
    this.value = null
    this.reason = null
    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
        this.fulfilledFnList.forEach((a) => {
          a(value)
        })
      }
    }

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        this.rejectedFnList.forEach((a) => {
          a(reason)
        })
      }
    }
    execute(resolve, reject)
  }
  then(fulfilledFn, rejectedFn) {
    return new MyPromise((resolve, reject) => {
      const handleFn = (callback, value) => {
        try {
          const x = callback(value)
          if (x instanceof MyPromise) {
            this.then(resolve, reject)
          } else {
            resolve(x)
          }
        } catch (error) {
          reject(error)
        }
      }
      if (this.state === PENDING) {
        this.fulfilledFnList.push(handleFn(fulfilledFn, this.value))
        this.rejectedFnList.push(handleFn(rejectedFn, this.reason))
      }
      if (this.state === FULFILLED) {
        handleFn(fulfilledFn, this.value)
      }
      if (this.state === REJECTED) {
        handleFn(rejectedFn, this.reason)
      }
    })
  }
}

new MyPromise((resolve, reject) => {
  console.log('1: 同步代码')
  setTimeout(() => {
    // resolve(123)
    reject(456)
  }, 2000)
}).then(
  (res) => {
    console.log('成功：', res)
  },
  (res) => {
    console.log('失败：', res)
  }
)
