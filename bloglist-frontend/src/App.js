import React, { useState, useEffect } from 'react'
import {
  connect,
  useDispatch,
  useSelector,
} from 'react-redux'

import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom'

import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Menu from './components/Menu'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import User from './components/User'
import Users from './components/Users'

import blogService from './services/blogs'

import {
  initializeBlogs,
  createBlog,
  removeBlog,
  addLikes
} from './reducers/blogReducer'

import { login, logout } from './reducers/loginReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeUsers } from './reducers/userReducer'

import {
  Container,
  Typography,
} from '@material-ui/core'


const App = (props) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = React.createRef()
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (loggedUserJSON) {
      blogService.setToken(loggedUserJSON.token)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const addBlogEntry = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      props.setNotification(`Entry ${blogObject.title} was creaated`, 'success', 5)
    }
    catch (exception) {
      console.error(exception)
      props.setNotification('Smth went wrong', 'error', 5)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const loggedInUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

    if (!loggedInUser) {
      try {
        const user = dispatch(login(username, password))
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
      } catch (exception) {
        props.setNotification('Wrong credentials', 'error', 5)
      }
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      props.logout()
      history.push('/login')
    } catch (exception) {
      props.setNotification('Log out error', 'error', 5)
    }
  }

  const loginForm = () => (
    // <Togglable buttonLabel='Login Form'>
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
    // </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog entry' ref={blogFormRef}>
      <BlogForm
        createBlogEntry={addBlogEntry}
      />
    </Togglable>
  )

  return (
    <Container>
      <div style={{ paddingBottom:'80px' }}>
        <Notification />
        <Menu user={user} handleLogout={handleLogout} />
        <Switch>
          {user === null ?
            <Route path='/login'>
              {loginForm()}
            </Route> :
            <>
              <Typography variant='h3'>Blogs</Typography>
              <Typography variant='h5'>{user.name} logged in</Typography>

              <Route path='/logout'>
              </Route>

              <Route path='/create'>
                {blogForm()}
              </Route>

              <Route exact path='/blogs'>
                <Blogs />
              </Route>

              <Route path="/blogs/:id" render={({ match }) =>
                (
                  <Blog blog={props.blogs.find(blog => blog.id === match.params.id)}
                    blogVisible={true} />
                )
              }
              />

              <Route exact path='/users' render={() => <Users />} />
              <Route path="/users/:id" render={() => <User />} />

            </>
          }
        </Switch>
      </div>
      <Footer />
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    users: state.users,
  }
}

const mapDispatchToProps = {
  setNotification,
  initializeBlogs,
  initializeUsers,
  createBlog,
  removeBlog,
  addLikes,
  login,
  logout
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectedApp



