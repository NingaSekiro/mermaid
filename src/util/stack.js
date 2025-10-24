export class Stack {
  constructor() {
    this.items = []
  }

  // 添加元素到栈顶
  push(element) {
    this.items.push(element)
  }

  // 移除并返回栈顶元素
  pop() {
    if (this.isEmpty()) {
      throw new Error('stack is empty')
    }
    return this.items.pop()
  }

  // 查看栈顶元素
  peek() {
    if (this.isEmpty()) {
      throw new Error('stack is empty')
    }
    return this.items[this.items.length - 1]
  }

  // 检查栈是否为空
  isEmpty() {
    return this.items.length === 0
  }

  // 获取栈的大小
  size() {
    return this.items.length
  }

  getElement(index) {
    if (index < 0 || index >= this.items.length) {
      throw new Error('index out of range')
    }
    return this.items[index]
  }

  // 清空栈
  clear() {
    this.items = []
  }
}