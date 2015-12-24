import React from 'react'

import classNames from './Header.scss'

export default function Header () {
  return (
    <header>
      <h1 className={classNames.title}>Instagram Insights</h1>
      <div className={classNames.meta}>
        <ul>
          <li>by <a className={classNames.link} href='http://cookpete.com' target='_blank'>Pete Cook</a></li>
          <li><a className={classNames.link} href='http://github.com/cookpete/instagram-insights' target='_blank'>Source</a></li>
        </ul>
      </div>
    </header>
  )
}
