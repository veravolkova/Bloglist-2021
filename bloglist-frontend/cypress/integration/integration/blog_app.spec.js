describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Vera Volkova',
      username: 'veravolkova',
      password: 'Salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blog app, Vera Popova 2020')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  //issues with antivirus software
  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('veravolkova')
    cy.get('#password').type('Salainen')
    cy.get('#login-button').click()

    cy.contains('Vera Volkova logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('veravolkova')
    cy.get('#password').type('Wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Vera Volkova logged in')
  })
})

describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'veravolkova', password: 'Salainen' })
  })

  it('a new blog entry can be created', function() {
    cy.contains('new blog entry').click()
    cy.get('#title').type('an entry created by cypress')
    cy.get('#author').type('cypress')
    cy.get('#url').type('https://www.cypress.io/')
    cy.contains('save').click()
    cy.contains('an entry created by cypress')
  })

  it('an author can remove a blog', function() {
    cy.contains('remove blog').click()
    cy.contains('Cypress').should('not.exist')
  })
})

describe('when blog is created', function() {
  beforeEach(function() {
    cy.login({ username: 'veravolkova', password: 'Salainen' })
    cy.createBlog({ title:'an entry created by cypress1', author: 'Cypress', url: 'https://www.cypress.io/' })
  })

  it('user can like a blog', function() {
    cy.contains('like').click()
    cy.contains('view').click()
    cy.contains('1')
  })

  it('another author can\'t remove a blog', function() {
    cy.contains('remove blog').click()
    cy.contains('logout').click()

    //crate new user
    const user = {
      name: 'Vera Popova',
      username: 'verapopova',
      password: 'Salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')

    //new user login
    cy.login({ username: 'verapopova', password: 'Salainen' })
    cy.contains('remove blog').click()
    cy.get('.error')
      .should('contain', 'Unauthorized')
    cy.contains('an entry created by cypress')
  })

  it('blogs are ordered according to likes desc', function() {
    cy.get('#main:first').contains('remove blog').click()
    cy.createBlog({ title:'an entry created by cypress2', author: 'Cypress', url: 'https://www.cypress.io/', likes: 3 })
    cy.createBlog({ title:'an entry created by cypress3', author: 'Cypress', url: 'https://www.cypress.io/', likes: 2 })

    cy.get('ul>li').then(function($lis){
      expect($lis).to.have.length(3)
      expect($lis.eq(0)).to.contain('an entry created by cypress2')
      console.log($lis.eq(0))
      expect($lis.eq(1)).to.contain('an entry created by cypress3')
      expect($lis.eq(2)).to.contain('an entry created by cypress1')
    })
  })
})
