import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button as ButtonMUI } from '@material-ui/core'


const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <ButtonMUI onClick={toggleVisibility}>{props.buttonLabel}</ButtonMUI>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <ButtonMUI onClick={toggleVisibility}>cancel</ButtonMUI>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable