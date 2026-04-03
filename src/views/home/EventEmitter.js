class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return
    }
    this.events[eventName].forEach((a) => {
      a(...args)
    })
  }
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return
    }
    this.events[eventName] = this.events[eventName].filter((a) => a !== callback)
  }
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}

// 实例化一个全局的事件总线（微信服务器）
const bus = new EventEmitter()

// ---------------- 订阅者们开始占座 ----------------

// 小明：关注了“文章更新”
const xiaoMing = (title) => {
  console.log(`小明收到了推送，准备阅读：${title}`)
}
bus.on('文章更新', xiaoMing)

// 小红：也关注了“文章更新”
bus.on('文章更新', (title) => {
  console.log(`小红收到了推送，随手点了个赞：${title}`)
})

// 小白：只抢一次红包，抢完就跑
bus.once('发红包', (amount) => {
  console.log(`小白抢到了 ${amount} 元！然后火速取关了。`)
})

// ---------------- 发布者开始搞事 ----------------

console.log('--- 第一次发文 ---')
// 公众号发布消息！小明和小红都会收到！
bus.emit('文章更新', '《深入理解 JavaScript 发布订阅模式》')

console.log('\n--- 发红包 ---')
// 发红包了！小白收到！
bus.emit('发红包', 100)
// 再次发红包，小白已经收不到了，因为他用的是 once
bus.emit('发红包', 50)

console.log('\n--- 小明取消关注，第二次发文 ---')
// 小明觉得文章太难了，取消关注
bus.off('文章更新', xiaoMing)

// 再次发文，这次只有小红能收到了！
bus.emit('文章更新', '《Vue 响应式原理剖析》')
