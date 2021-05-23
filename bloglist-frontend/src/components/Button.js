import React from 'react'
import { Button as ButtomMUI } from '@material-ui/core'

export default function Button(props) {
  return (
    <ButtomMUI onClick={props.handleClick} color={props.color}>
      {props.text}
    </ButtomMUI>
  )
}


