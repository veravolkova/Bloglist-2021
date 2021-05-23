const initialState = {
  message: '',
  messageType: '',
  seconds: 0,
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    clearTimeout(state.timeout)
    console.log(action.type)
    return action.data
  case 'HIDE_NOTIFICATION':
    return initialState

  default:
    return state
  }
}

export const setNotification = (message, messageType, seconds) => {
  console.log(message)
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        messageType,
        timeout: setTimeout(() => {
          dispatch(hideNotification())
        }, seconds*1000)
      }
    })
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE_NOTIFICATION',
  }
}

export default notificationReducer
