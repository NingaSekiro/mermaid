import { expect, test } from 'vitest'
import { convertToMermaid, simplifyMethod } from '@/util/mermaidConverter.js'

test('simplifyMethod', () => {
  expect(simplifyMethod('public com.example.demo.controller.Model com.example.demo.controller.DemoController1.middle(java.lang.Integer)'))
    .toStrictEqual({
      permission: 'public',
      returnSimpleClassName: 'Model',
      simpleTargetClassName: 'DemoController1',
      methodDesc: 'middle(Integer)'
    })
})

test('convertToMermaid', () => {
  const exampleMethodCalls = [
    {
      methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      isInboundCall: true
    },
    {
      methodName: 'public com.example.demo.controller.Model com.example.demo.controller.DemoController1.middle(java.lang.Integer)',
      isInboundCall: true
    },
    {
      methodName: 'public com.example.demo.controller.Model com.example.demo.controller.DemoController1.middle(java.lang.Integer)',
      isInboundCall: false
    },
    {
      methodName: 'public void com.example.demo.controller.DemoController.middlec(java.lang.Integer)',
      isInboundCall: true
    },
    {
      methodName: 'public void com.example.demo.controller.DemoController.middlec(java.lang.Integer)',
      isInboundCall: false
    },
    {
      methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      isInboundCall: false
    }
  ]
  console.log(convertToMermaid(exampleMethodCalls))
})

test('convertToMermaid2', () => {
  const exampleMethodCalls = [
    {
      methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      isInboundCall: true
    },
    {
      methodName: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      isInboundCall: false
    }
  ]
  console.log(convertToMermaid(exampleMethodCalls))
})
