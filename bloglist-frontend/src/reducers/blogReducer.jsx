import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {

  switch(action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'ADD_LIKE': {
    const id = action.data.id
    const blogToLike = state.find(blog => blog.id === id)
    const clickedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }
    return state.map(blog =>
      blog.id !== id ? blog : clickedBlog
    )}
  case 'ADD_COMMENT': {
    const newComment = action.data.newComment
    const blogToComment = state
      .find(b => b.id === action.data.blog.id)

    const commentedBlog = {
      ...blogToComment,
      comments: [...blogToComment.comments, newComment],
    }
    return state.map(b => (b.id === commentedBlog.id ? commentedBlog : b))
  }
  case 'DELETE_BLOG': {
    const id = action.data
    return state.filter((blog) => blog.id !== id)
  }
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createBlog = (data) => {
  return async dispatch => {
    const newBlog = await blogService.create(data)

    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const addLikes = (id, blog) => {
  return async dispatch => {
    const clickedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    const updatedBlog = await blogService.update(id, clickedBlog)
    dispatch({
      type: 'ADD_LIKE',
      data: updatedBlog,
    })
  }
}

export const addComment = (blog, commentObject) => {
  return async dispatch => {
    const newComment = await blogService.comment(
      blog.id,
      commentObject
    )
    dispatch({
      type: 'ADD_COMMENT',
      data: { newComment, blog }
    })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: { id },
    })
  }
}

export default blogReducer
