const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const auth = {}

beforeEach(async () => {
  //jest.setTimeout(100000)

  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'veravolkova', passwordHash })
  await user.save()

  const response =
    await api
      .post('/api/login')
      .send({
        username: 'veravolkova',
        password: 'sekret'
      })

  auth.token = response.body.token
  auth.current_user_id = jwt.decode(auth.token).id
})

describe('when there is initially some blog entries saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(title).toContain(
      'React patterns'
    )
  })
})

describe('addition of a new blog entry', () => {
  test('a valid blog entry can be added ', async () => {
    const newBlogEntry = {
      title:'First class tests',
      author:'Robert C. Martin',
      url:'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes:10,
      user: {
        username: 'veravolkova',
        name: 'Vera Volkova',
        id: '5ea48b263938db26bca1f32d'
      },
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${auth.token}`)
      .send(newBlogEntry)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain(
      'First class tests'
    )
  })

  test('blog entry without title and url is not added', async () => {
    const newBlogEntry = {
      author:'Robert C. Martin',
      likes:0,
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${auth.token}`)
      .send(newBlogEntry)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const author = blogsAtEnd.map(b => b.author)
    expect(author).not.toContain('Robert C. Martin')
  })
})

describe('viewing a specific blog entry', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if blog entry does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })


  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId =  '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('deletion of a blog entry', () => {
  test.skip('a blog entry can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    blogToDelete.user = auth.current_user_id

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', `bearer ${auth.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('changing a blog entry', () => {
  test('changing number of likes ', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToChange = {
      title:'React patterns',
      author:'Michael Chan',
      url:'https://reactpatterns.com/',
      likes:70
    }

    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(blogToChange)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(blogToChange.likes)
  })
})

describe('some random blogs tests', () => {
  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlogEntry = {
      title: 'Go To Statement Considered Harmful',
      author:'Edsger W. Dijkstra',
      url:'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${auth.token}`)
      .send(newBlogEntry)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(0)
  })
})

//users
describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails is password length is less than 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails if the username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'veravolkova',
      name: 'Matti Luukkainen',
      password: 'Password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const names = usersAtEnd.map(u => u.name)
    expect(names).not.toContain(newUser.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})