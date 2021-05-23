import React, { useEffect, }  from 'react'
import { useRouteMatch } from 'react-router-dom'
import { connect, useDispatch, } from 'react-redux'

import { initializeUsers } from '../reducers/userReducer'
import Blog from './Blog'


const User = props => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const match = useRouteMatch('/users/:id')
  const user = match ? props.users.find((user) => user.id === match.params.id) : null

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name} blogs:</h2>
      {user.blogs.length === 0 ? (
        <h3>User has no blogs yet</h3>
      ) : (
        <ul>
          {user.blogs.map(blog => {
            return (
              <>
                <li key={blog.id}> <Blog blog={blog} /></li>
                <br/>
              </>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}
const mapDispatchToProps = {
  initializeUsers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)