import React, { Component, PropTypes } from 'react'
import loadScript from 'load-script'

import classNames from './Map.scss'

const API_URL = 'https://maps.googleapis.com/maps/api/js'
const API_KEY = 'AIzaSyDt0urZfFYaJq7w-2w-0aigf1zH3F4Cw3w'
const CALLBACK = 'initMap'

export default class Map extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired
  }

  componentDidMount () {
    window[CALLBACK] = () => this.drawMap(window.google.maps)
    loadScript(`${API_URL}?key=${API_KEY}&callback=${CALLBACK}`)
  }

  drawMap (maps) {
    const map = new maps.Map(this.refs.map, {
      zoom: 3,
      center: {
        lat: this.props.posts[0].location.latitude,
        lng: this.props.posts[0].location.longitude
      },
      styles
    })

    this.props.posts.forEach(({ location, images }) => {
      const info = new maps.InfoWindow({ content: `<img src='${images.thumbnail.url}' />` })
      const marker = new maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude
        },
        icon: 'http://iconizer.net/files/Splashyfish/orig/marker_rounded_grey_4.png',
        map
      })
      marker.addListener('click', () => info.open(map, marker))
    })
  }

  render () {
    return <div ref='map' className={classNames.map} />
  }
}

// https://snazzymaps.com/style/151/ultra-light-with-labels
const styles = [{'featureType': 'water', 'elementType': 'geometry', 'stylers': [{'color': '#e9e9e9'}, {'lightness': 17}]}, {'featureType': 'landscape', 'elementType': 'geometry', 'stylers': [{'color': '#f5f5f5'}, {'lightness': 20}]}, {'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{'color': '#ffffff'}, {'lightness': 17}]}, {'featureType': 'road.highway', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#ffffff'}, {'lightness': 29}, {'weight': 0.2}]}, {'featureType': 'road.arterial', 'elementType': 'geometry', 'stylers': [{'color': '#ffffff'}, {'lightness': 18}]}, {'featureType': 'road.local', 'elementType': 'geometry', 'stylers': [{'color': '#ffffff'}, {'lightness': 16}]}, {'featureType': 'poi', 'elementType': 'geometry', 'stylers': [{'color': '#f5f5f5'}, {'lightness': 21}]}, {'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [{'color': '#dedede'}, {'lightness': 21}]}, {'elementType': 'labels.text.stroke', 'stylers': [{'visibility': 'on'}, {'color': '#ffffff'}, {'lightness': 16}]}, {'elementType': 'labels.text.fill', 'stylers': [{'saturation': 36}, {'color': '#333333'}, {'lightness': 40}]}, {'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'transit', 'elementType': 'geometry', 'stylers': [{'color': '#f2f2f2'}, {'lightness': 19}]}, {'featureType': 'administrative', 'elementType': 'geometry.fill', 'stylers': [{'color': '#fefefe'}, {'lightness': 20}]}, {'featureType': 'administrative', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#fefefe'}, {'lightness': 17}, {'weight': 1.2}]}]
