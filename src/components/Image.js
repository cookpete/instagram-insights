import React, { Component, PropTypes } from 'react'

import classNames from './Image.scss'

export default class Image extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  state = {
    loaded: false
  }

  componentDidMount () {
    const img = document.createElement('img')
    img.onload = this.onLoad
    img.src = this.props.src
  }

  onLoad = () => {
    this.setState({
      loaded: true
    })
  }

  render () {
    const { loaded } = this.state
    const { className, ...props } = this.props
    let classes = loaded ? classNames.loaded : classNames.loading

    return (
      <img ref='img' {...props} className={className + ' ' + classes} />
    )
  }
}
