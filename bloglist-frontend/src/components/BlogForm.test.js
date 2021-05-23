import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlogEntry = jest.fn()

  const component = render(
    <BlogForm createBlogEntry={createBlogEntry} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing of forms could be easier' }
  })
  fireEvent.change(author, {
    target: { value: 'test author 10' }
  })
  fireEvent.change(url, {
    target: { value: 'test url 10' }
  })
  fireEvent.submit(form)

  expect(createBlogEntry.mock.calls).toHaveLength(1)
  expect(createBlogEntry.mock.calls[0][0].title).toBe('testing of forms could be easier' )
  expect(createBlogEntry.mock.calls[0][0].author).toBe('test author 10' )
  expect(createBlogEntry.mock.calls[0][0].url).toBe('test url 10' )
})

