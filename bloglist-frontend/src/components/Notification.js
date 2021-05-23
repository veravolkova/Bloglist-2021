import React from 'react'
import { connect } from 'react-redux'
import { Alert } from '@material-ui/lab'


const Notification = ( props ) => {

  return (
    <Alert severity={props.notification.messageType}>
      {props.notification.message}
    </Alert>
  )
}

const mapStateToProps = ( state ) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(
  mapStateToProps,
  null
)(Notification)

export default ConnectedNotification




