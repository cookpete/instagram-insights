import React from 'react'
import { render } from 'react-dom'
import webfont from 'webfontloader'

import { getToken, createGetter } from './instagram'
import App from './components/App'

webfont.load({
  google: {
    families: ['Open Sans:300'],
    text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
})

const token = getToken(window.location.hash)
const get = token ? createGetter(token) : null

render(<App token={token} get={get} />, document.getElementById('app'))
