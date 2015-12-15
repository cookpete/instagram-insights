import React, { Component, PropTypes } from 'react'

import Image from './Image'

import classNames from './Table.scss'

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    getId: PropTypes.func.isRequired,
    getCount: PropTypes.func,
    getTitle: PropTypes.func,
    getImage: PropTypes.func,
    getLink: PropTypes.func
  }
  static defaultProps = {
    getCount: item => item.count
  }
  state = {
    limit: 5
  }
  showMore = () => {
    this.setState({
      limit: this.state.limit + 5
    })
  }
  renderItem = item => {
    const { getId, getCount, getTitle, getImage, getLink } = this.props
    const id = getId(item)
    const count = getCount(item)
    const title = getTitle ? getTitle(item) : ''
    const image = getImage ? getImage(item) : null
    const link = getLink ? getLink(item) : null

    let avatar = <Image src={image} className={classNames.image} />
    if (link) {
      avatar = <a href={link} target='_blank'>{ avatar }</a>
    }

    return (
      <li key={id} className={classNames.item}>
        { avatar }
        <div className={classNames.title}>{ title }</div>
        <div className={classNames.count}>{ count }</div>
      </li>
    )
  }
  render () {
    const { data } = this.props
    const { limit } = this.state
    return (
      <ol className={classNames.table}>
        { data.slice(0, limit).map(this.renderItem) }
        { limit < data.length &&
          <li className={classNames.moreItem}>
            <button className={classNames.moreButton} onClick={this.showMore}>More</button>
          </li>
        }
      </ol>
    )
  }
}
