import { Stack } from './stack.js'

/**
 * 将方法调用列表转换为mermaid时序图代码
 * @param {Array} methodCalls - 方法调用列表
 * @returns {string} mermaid时序图代码
 */
export function convertToMermaid(methodCalls) {
  const participants = new Set()
  participants.add('Thread')

  // 使用栈来记录调用链
  const callStack = new Stack()
  callStack.push('Thread')

  let methodCall = ''
  // 处理每个方法调用
  methodCalls.forEach((call) => {
    const { permission, returnSimpleClassName, simpleTargetClassName, methodDesc } = simplifyMethod(call.methodName)
    const caller = callStack.peek()
    participants.add(simpleTargetClassName)
    if (call.isInboundCall) {
      if (caller === simpleTargetClassName) {
        // 同一类的调用，不激活和去激活
        methodCall += `    ${caller}->>${simpleTargetClassName}: ${methodDesc}\n`
        callStack.push(simpleTargetClassName)
      } else {
        // 不同类的调用，激活目标类
        methodCall += `    ${caller}->>+${simpleTargetClassName}: ${methodDesc}\n`
        callStack.push(simpleTargetClassName)
      }
    } else {
      //同一类的调用
      if (callStack.size() > 1 && callStack.getElement(callStack.size() - 2) === simpleTargetClassName) {
        callStack.pop()
      } else {
        callStack.pop()
        const returnTo = callStack.peek()
        methodCall += `    ${caller}-->>-${returnTo}: \n`
      }
    }
  })
  let participantsDefinitions = ''
  // 添加所有参与者定义
  participants.forEach(participant => {
    participantsDefinitions += `    participant ${participant}\n`
  })
  return `sequenceDiagram\n${participantsDefinitions}${methodCall}`
}

/**
 * @param {string} fullMethod - 方法签名字符串
 */
export function simplifyMethod(fullMethod) {
  const permission = fullMethod.split(' ')[0]
  const returnSimpleClassName = fullMethod.split(' ')[1].substring(fullMethod.split(' ')[1].lastIndexOf('.') + 1)
  const simpleTargetClassName = fullMethod.split(' ')[2].split('(')[0].split('.').slice(-2)[0]
  const regex = /(\w+\([^)]*\))$/
  const methodDescription = fullMethod.match(regex)[1]
  const methodDesc = methodDescription.replace(/[\w$.]+/g, m => m.includes('.') ? m.substring(m.lastIndexOf('.') + 1) : m)
  return { permission, returnSimpleClassName, simpleTargetClassName, methodDesc }
}

