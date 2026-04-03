function concurrentRequests(tasks, maxNum) {
  return new Promise((resolve) => {
    let index = 0
    let complete = 0
    let result = []
    const nextFun = () => {
      if (index >= tasks.length) return
      const currentIndex = index
      const currentFn = tasks[currentIndex]
      index++
      currentFn()
        .then((res) => {
          result[currentIndex] = res
        })
        .catch((error) => {
          result[currentIndex] = error
        })
        .finally(() => {
          complete++
          if (complete >= tasks.length) {
            resolve(result)
          } else {
            nextFun()
          }
        })
    }
    const limitNum = Math.min(tasks.length, maxNum)
    for (let i = 0; i < limitNum; i++) {
      nextFun()
    }
  })
}

// 模拟一个请求：传入任务 ID 和耗时
const mockRequest = (id, time) => {
  return () =>
    new Promise((resolve) => {
      console.log(`🚀 任务 ${id} 开始请求...`)
      setTimeout(() => {
        console.log(`✅ 任务 ${id} 完成！耗时 ${time}ms`)
        resolve(`结果 ${id}`)
      }, time)
    })
}

// 准备 8 个任务，时间长短不一
const tasks = [
  mockRequest(1, 1000),
  mockRequest(2, 500),
  mockRequest(3, 300), // 这个跑得最快，它会让出第一个窗口！
  mockRequest(4, 400),
  mockRequest(5, 800),
  mockRequest(6, 600),
  mockRequest(7, 500),
  mockRequest(8, 700)
]

concurrentRequests(tasks, 3).then((res) => {
  console.log('res', res)
})
