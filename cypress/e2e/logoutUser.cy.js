describe('User logs out', () => {

  describe('user successfully logs out', () =>{

    before(() => {
      cy.visit('http://localhost:5173/login')

      cy.viewport(1920,1080) 
  
      cy.get('[data-testid="cypress-input-email-login"]').type('ari@gmail.com')
      cy.get('[data-testid="cypress-input-pass-login"]').type('123')
  
      cy.get('[data-testid="cypress-loginUser-form"]').submit()
  
      cy.wait(2000)
    })

    beforeEach(() => {
      cy.visit('http://localhost:5173/doctors')

      cy.get('[data-testid=cypress-loginUser-profileBtn]').click()
      cy.get('[data-testid="cypress-logout-sideNavButton"]').click()
      cy.get('[data-testid="cypress-button-logout"]').click()
    })

    it('successfully deletes the accessToken from the storage of the browser and redirects to home', () => {
      cy.window().then((win) => {
        const accessToken = win.sessionStorage.getItem("accessToken")
        expect(accessToken).to.be.null;
      })
  
      cy.url().should('include', 'http://localhost:5173/')
    })

  })

})