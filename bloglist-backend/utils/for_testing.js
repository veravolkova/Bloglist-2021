const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

//total likes of all blogs
const totalLikes = (blogs) => {
  return blogs.reduce((prev, cur) => prev + cur.likes, 0) || 0
}

//blog that has most likes
const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((prev, cur) => (+prev.likes > +cur.likes) ? prev : cur) || 0
  const { _id, __v, url, ...result } = favBlog
  return result
}

//author that has most blogs
const mostBlogs = (blogs) => {
  const result =
    !blogs[0].author ? {} :
      _(blogs)
        .countBy('author')
        .map((item, auth) => ({
          author: auth,
          blogs: item
        }))
        .sortBy('blogs')
        .reverse()
        .value()[0]

  return result
}

//author that has most likes in total
const mostLikes = (blogs) => {
  const result =
    !blogs[0].author ? {} :
      _(blogs)
        .groupBy('author')
        .map((item, auth) => ({
          author: auth,
          likes: _.sumBy(item, 'likes')
        }))
        .sortBy('likes')
        .reverse()
        .value()[0]

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}


