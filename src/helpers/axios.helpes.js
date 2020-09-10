import axios from 'axios'

/**
 * @desc brief description
 * @param string , number , object, array, bool ...
 * @return bool - success or failure
 */
export const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

// check if is better const currentTime = Date.now() / 1000
export const isExpire = exp => exp < Date.now() / 1000

export const removeCredentials = () => {
  // Remove token from localStorage
  localStorage.removeItem('token')
  // Remove the auth header for future requests
  setAuthToken(false)
}

export async function handleResponse(response) {
  if (response.status === 200) return response.data
  if (response.status === 400) {
    // So, a server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.response.data
    throw new Error(error)
  }
  throw new Error('Network response was not ok.')
}

// In a real app, would likely call an error logging service.
export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error('API call failed. ' + error)
  throw error
}

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // console.log({ config })
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // console.log({ response })
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response)
  }
)

// GET  URL : /TESTS OR /TEST:ID
export const get = url =>
  axios
    .get(url)
    .then(response => handleResponse(response))
    .catch(error => handleError(error))

// POST for create, PUT to update when id already exists.
export function save(url, data = null) {
  return axios({
    method: data.id ? 'PUT' : 'POST',
    url: `${url} ${'/' + data._id || ''}`,
    data
  })
    .then(response => handleResponse(response))
    .catch(error => handleError(error))
}

export const del = url =>
  axios
    .delete(url)
    .then(response => handleResponse(response))
    .catch(error => handleError(error))
