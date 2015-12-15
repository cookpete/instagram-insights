import React from 'react'
import { render } from 'react-dom'
import webfont from 'webfontloader'

import { createGetter } from './instagram'
import App from './components/App'

webfont.load({
  google: {
    families: ['Open Sans:300'],
    text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
})

const get = createGetter(window.location.hash)

render(<App get={get} />, document.getElementById('app'))
