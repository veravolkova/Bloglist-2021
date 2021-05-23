import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const Blogs = ( props ) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {props.blogs
              .sort((a, b) => a.likes < b.likes ? 1 : -1)
              .map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Blog blog={blog} blogVisible={false}/>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs
  }
}

export default connect(
  mapStateToProps,
  null
)(Blogs)
