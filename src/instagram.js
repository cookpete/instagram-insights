import fetch from 'fetch-jsonp'
import { stringify } from 'query-string'
import { normalize, Schema, arrayOf } from 'normalizr'
import deepmerge from 'deepmerge'
import pairs from 'lodash.pairs'

const APP_URL = process.env.NODE_ENV === 'production' ? 'http://cookpete.com/instagram/' : 'http://localhost:3000'
const CLIENT_ID = 'de82ab327cef43a5a130fcea4b4d87e6'
const API_URL = 'https://api.instagram.com/v1/'
const MATCH_TOKEN = /#access_token=([0-9a-z\.]+)/
const MIN_POSTS = 200

export const BASE_URL = 'https://instagram.com/'
export const AUTH_URL = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${APP_URL}&response_type=token`
export const INITIAL_STATE = {
  entities: {},
  posts: []
}

export function createGetter (hash) {
  const match = hash.match(MATCH_TOKEN)

  if (match) {
    const token = match[1]
    return function (path, options = {}) {
      const query = stringify(Object.assign(options, { access_token: token }))
      return fetch(API_URL + path + '?' + query)
        .then(response => response.json())
    }
  }
  return false
}

const schemas = {
  user: new Schema('user'),
  media: new Schema('media')
}

schemas.media.define({
  caption: { from: schemas.user },
  comments: { data: arrayOf({ from: schemas.user }) },
  likes: { data: arrayOf(schemas.user) },
  user: schemas.user,
  users_in_photo: arrayOf({ user: schemas.user })
})

export function getStats (get) {
  return get('users/self/media/recent', { count: 100 }).then(response => {
    return processMedia(INITIAL_STATE, response)
  }).then(state => {
    return Promise.all(state.posts.reduce(createPostReducer(get, state), [])).then(mergables => {
      return mergables.reduce((state, mergable) => deepmerge(state, mergable), state)
    })
  }).then(state => calculateStats(state))
}

function processMedia (state, response) {
  state = mergeMedia(state, response)

  if (response.pagination.next_url && state.posts.length < MIN_POSTS) {
    return fetch(response.pagination.next_url)
      .then(response => response.json())
      .then(response => processMedia(state, response))
  }

  return state
}

function mergeMedia (state, response) {
  const { entities, result } = normalize(response.data, arrayOf(schemas.media))
  return deepmerge(state, {
    entities,
    posts: result
  })
}

function createPostReducer (get, state) {
  return function postReducer (requests, id) {
    const post = state.entities.media[id]
    if (post.likes.count > 4 && post.likes.count < 100) {
      requests.push(
        get(`media/${id}/likes`).then(
          response => createMergable(id, response, 'likes', schemas.user)
        )
      )
    }
    if (post.comments.count > 8 && post.comments.count < 100) {
      requests.push(
        get(`media/${id}/comments`).then(
          response => createMergable(id, response, 'comments', { from: schemas.user })
        )
      )
    }
    return requests
  }
}

function createMergable (id, response, key, schema) {
  const { entities, result } = normalize(response.data, arrayOf(schema))
  return {
    entities: deepmerge(entities, {
      media: {
        [id]: {
          [key]: {
            data: result
          }
        }
      }
    })
  }
}

function calculateStats (state) {
  console.log('calculating', state)
  const maps = state.posts.reduce((maps, id) => {
    const post = state.entities.media[id]

    post.likes.data.forEach(count(maps.likes))
    post.comments.data.forEach(comment => count(maps.comments)(comment.from))
    count(maps.filters)(post.filter)

    return maps
  }, {
    likes: {},
    comments: {},
    filters: {}
  })

  return deepmerge(state, {
    likes: sortObject(maps.likes, 'user'),
    comments: sortObject(maps.comments, 'user'),
    filters: sortObject(maps.filters, 'filter')
  })
}

export function denormalize (state) {
  const { user, media } = state.entities
  return deepmerge(state, {
    likes: state.likes.map(item => deepmerge(item, { user: user[item.user] })),
    comments: state.comments.map(item => deepmerge(item, { user: user[item.user] })),
    posts: state.posts.map(id => media[id])
  })
}

// Factory function to count the occurences of a given id
// and store the count in an object against that id
function count (object) {
  return function (id) {
    object[id] = object[id] ? object[id] + 1 : 1
  }
}

// Takes an object of user ids and occurence counts
// and returns a sorted array
function sortObject (object, keyName) {
  return pairs(object).map(pair => {
    const [key, count] = pair
    return {
      [keyName]: key,
      count
    }
  }).sort((a, b) => b.count - a.count)
}
