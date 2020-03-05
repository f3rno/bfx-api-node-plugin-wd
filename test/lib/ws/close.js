/* eslint-env mocha */
'use strict'

const assert = require('assert')
const _isEmpty = require('lodash/isEmpty')
const _isObject = require('lodash/isObject')
const onWSClose = require('../../../lib/ws/close')

describe('ws:close', () => {
  it('does nothing if autoReconnect is not enabled', () => {
    const handler = onWSClose({}, {
      autoReconnect: false
    })

    const res = handler()

    assert.strictEqual(res[0], null)
    assert.ok(_isObject(res[1]) && _isEmpty(res[1]))
  })

  it('emits reconnect event on a timeout if autoReconnect is enabled', (done) => {
    const handler = onWSClose({
      emit: (ev, eventName) => {
        assert.strictEqual(ev, 42)
        assert.strictEqual(eventName, 'reconnect')
        done()
      }
    }, {
      autoReconnect: true,
      reconnectDelay: 10
    })

    const res = handler({
      state: {
        ev: 42
      }
    })

    const [, stateUpdate] = res
    assert.strictEqual(stateUpdate.isReconnecting, true)
  })
})
