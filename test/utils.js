import { describe, it } from 'mocha'
import { expect } from 'chai'

import { shorten } from '../src/utils'

describe('shorten', () => {
  it('shortens', () => {
    expect(shorten(1000000)).to.equal('1m')
    expect(shorten(2345678)).to.equal('2.3m')
    expect(shorten(1000)).to.equal('1k')
    expect(shorten(2345)).to.equal('2.3k')
    expect(shorten(999)).to.equal('999')
  })
})
