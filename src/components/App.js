import React, { Component, PropTypes } from 'react'
import lscache from 'ls-cache'

import 'normalize.css/normalize.css'
import classNames from './App.scss'

import { BASE_URL, AUTH_URL, INITIAL_STATE, getStats, denormalize } from '../instagram'
import Header from './Header'
import UserInfo from './UserInfo'
import Table from './Table'
import Map from './Map'

const CACHE_EXPIRY = 10 // Minutes

export default class App extends Component {
  static propTypes = {
    token: PropTypes.string,
    get: PropTypes.func
  }
  state = INITIAL_STATE
  componentDidMount () {
    const { token, get } = this.props
    const cached = lscache.get(token)
    if (cached) {
      this.setState(denormalize(cached))
    } else if (get) {
      getStats(get).then(state => {
        this.setState(denormalize(state))
        lscache.set(token, state, CACHE_EXPIRY)
      })
    }
  }
  renderContent () {
    if (!this.props.token) {
      return (
        <a href={AUTH_URL}>Login</a>
      )
    }
    if (this.state.posts.length === 0) {
      return <div>Loading</div>
    }
    return (
      <main>
        <UserInfo user={this.state.user} posts={this.state.posts} />
        <section className={classNames.section}>
          <header>
            <h2 className={classNames.heading}>Biggest Fans</h2>
            <div className={classNames.subheading}>Users who have liked your posts the most</div>
          </header>
          { this.state.likes &&
            <Table
              data={this.state.likes}
              getId={item => item.user.id}
              getTitle={item => item.user.username}
              getImage={item => item.user.profile_picture}
              getLink={item => BASE_URL + item.user.username}
            />
          }
        </section>
        <section className={classNames.section}>
          <header>
            <h2 className={classNames.heading}>Commenters</h2>
            <div className={classNames.subheading}>Users who have commented on your posts the most</div>
          </header>
          { this.state.comments &&
            <Table
              data={this.state.comments}
              getId={item => item.user.id}
              getTitle={item => item.user.username}
              getImage={item => item.user.profile_picture}
              getLink={item => BASE_URL + item.user.username}
            />
          }
        </section>
        <section className={classNames.section}>
          <header>
            <h2 className={classNames.heading}>Best Posts</h2>
            <div className={classNames.subheading}>Posts with the most likes</div>
          </header>
          { this.state.posts &&
            <Table
              data={
                this.state.posts.slice()
                  .filter(item => item.likes.count)
                  .sort((a, b) => b.likes.count - a.likes.count)
              }
              getId={item => item.id}
              getCount={item => item.likes.count}
              getTitle={item => item.caption ? item.caption.text : ''}
              getImage={item => item.images.thumbnail.url}
              getLink={item => item.link}
            />
          }
        </section>
        <section className={classNames.section}>
          <header>
            <h2 className={classNames.heading}>Most Comments</h2>
            <div className={classNames.subheading}>Posts with the most comments</div>
          </header>
          { this.state.posts &&
            <Table
              data={
                this.state.posts.slice()
                  .filter(item => item.comments.count)
                  .sort((a, b) => b.comments.count - a.comments.count)
              }
              getId={item => item.id}
              getCount={item => item.comments.count}
              getTitle={item => item.caption ? item.caption.text : ''}
              getImage={item => item.images.thumbnail.url}
              getLink={item => item.link}
            />
          }
        </section>
        <section>
          <header>
            <h2 className={classNames.heading}>Map</h2>
            <div className={classNames.subheading}>See your posts across the globe</div>
          </header>
          <Map posts={this.state.posts.filter(post => post.location)} />
        </section>
      </main>
    )
  }
  render () {
    return (
      <div className={classNames.app}>
        <Header />
        { this.renderContent() }
      </div>
    )
  }
}
