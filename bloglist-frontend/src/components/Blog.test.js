import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  // eslint-disable-next-line no-unused-vars

  const blog = {
    title: 'Test Blog 9',
    author: 'Test author 9',
    url: 'www.testurl9',
    likes: 5
  }

  let component
  // eslint-disable-next-line no-unused-vars
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} handleLikesIncr={mockHandler}/>
    )
  })

  test('displays only title and author by default', () => {
    const divMin = component.container.querySelector('.minDetails')
    const divMax = component.container.querySelector('.maxDetails')

    expect(divMin).toBeVisible()
    expect(divMax).toBeFalsy()
  })

  test('renders content', () => {
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Test Blog 9'
    )
  })

  test('clicking the like button 2 times calls event handler twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('url and likes shown when the view button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.maxDetails')
    expect(div).toBeVisible()
  })
})
