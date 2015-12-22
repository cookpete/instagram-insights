import React from 'react'

import Image from './Image'
import { BASE_URL } from '../instagram'

import classNames from './UserInfo.scss'

export default function UserInfo ({ user, posts }) {
  return (
    <section className={classNames.section}>
      <a href={BASE_URL + user.username} target='_blank' className={classNames.username}>
        <Image src={user.profile_picture} className={classNames.image} />
      </a>
      <strong>{ user.username }</strong>
      <p className={classNames.info}>
        Analysing <strong>{posts.length} posts</strong> from the last <strong>{getTimeSpan(posts)}</strong>
      </p>
    </section>
  )
}

function getTimeSpan (posts) {
  const earliest = new Date(posts[posts.length - 1].created_time * 1000)
  const diff = new Date() - earliest
  const weeks = Math.round(diff / 1000 / 60 / 60 / 24 / 7)
  if (weeks < 52) {
    return weeks + ' weeks'
  }
  const years = Math.floor(weeks / 52)
  const remainder = weeks - (years * 52)
  return plural(years, 'year') + (remainder ? ' and ' + plural(remainder, 'week') : '')
}

function plural (n, string) {
  return n === 1 ? `${n} ${string}` : `${n} ${string}s`
}
