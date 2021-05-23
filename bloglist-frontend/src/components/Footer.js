import React from 'react'

const Footer = () => {
  const footerStyle = {
    color: 'grey',
    fontStyle: 'italic',
    fontSize: 16,
    backgroundColor: '#F8F8F8',
    borderTop: '1px solid #E7E7E7',
    textAlign: 'center',
    padding: '20px',
    position: 'fixed',
    left: '0',
    bottom: '0',
    height: '60px',
    width: '100%',
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Blog app, Vera Popova 2020</em>
    </div>
  )
}

export default Footer