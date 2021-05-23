import React from 'react'

const Comment = props => {
  const comment = props.comment.commentText

  if (!props.comment) {
    return null
  }

  return (
    <>
      {comment}
    </>
  )
}

export default Comment