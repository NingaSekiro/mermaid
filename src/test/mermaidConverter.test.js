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
      method: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      inboundCall: true
    },
    {
      method: 'public com.example.demo.controller.Model com.example.demo.controller.DemoController1.middle(java.lang.Integer)',
      inboundCall: true
    },
    {
      method: 'public com.example.demo.controller.Model com.example.demo.controller.DemoController1.middle(java.lang.Integer)',
      inboundCall: false
    },
    {
      method: 'public void com.example.demo.controller.DemoController.middlec(java.lang.Integer)',
      inboundCall: true
    },
    {
      method: 'public void com.example.demo.controller.DemoController.middlec(java.lang.Integer)',
      inboundCall: false
    },
    {
      method: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      inboundCall: false
    }
  ]
  console.log(convertToMermaid(exampleMethodCalls))
})

test('convertToMermaid2', () => {
  const exampleMethodCalls = [
    {
      method: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      inboundCall: true
    },
    {
      method: 'public void com.example.demo.controller.DemoController.testScheduled5()',
      inboundCall: false
    }
  ]
  console.log(convertToMermaid(exampleMethodCalls))
})
