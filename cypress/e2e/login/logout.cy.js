describe('Logout',()=>{

    const email = 'jdgapjdgap@gmail.com'
    const password = 'asdfg1'

    beforeEach(()=>{
        cy.visit('/')
    })

    it('Logout Success Regular Account',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(email)
        cy.get('.input-password > .form-control').click().type(password)
        cy.get('.d-grid').click()
        cy.wait(10000)
        cy.get('.rounded-circle').should('be.visible')
        cy.get('.router-link-active > div > span').should('have.text','Dashboard')
        cy.get(':nth-child(3) > .dropdown-toggle').should('have.length', 1).click()
        cy.get('.dropdown-menu > :nth-child(2)').click()
        cy.get('.mt-0').should('have.text','Sampai Jumpa Kembali!')
    })
})