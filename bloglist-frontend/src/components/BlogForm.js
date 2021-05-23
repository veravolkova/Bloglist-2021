import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  TextField,
} from '@material-ui/core'

const BlogForm = ({ createBlogEntry }) => {

  const [values, setValues] = useState({ title: '', author: '', url: '' })
  const history = useHistory()

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const addBlogEntry = (event) => {
    event.preventDefault()
    createBlogEntry({
      title: values.title,
      author: values.author,
      url: values.url,
    })
    history.push('/blogs')
    //console.log(values.title)
    setValues({ title: '', author: '', url: '' })
  }

  return (
    <div className="formDiv">
      <h4>Create a new entry</h4>
      <form onSubmit={addBlogEntry}>
        <div>
          <TextField
            label='title'
            type='text'
            id='title'
            value={values.title}
            name='title'
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label='author'
            type='text'
            id='author'
            value={values.author}
            name='author'
            onChange={handleInputChange}
          />
        </div>
        <div>
          <TextField
            label='url'
            type='text'
            id='url'
            value={values.url}
            name='url'
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">save</Button>
      </form>
    </div>
  )
}

export default BlogForm


