describe('Login',()=>{
    const email = 'jdgapjdgap@gmail.com'
    const password = 'asdfg1'
    const wrongEmail = 'dgapjdgap@gmail.com'
    const wrongPassword = 'asdfg'
    const invalidEmail = 'jdgapjd'

    beforeEach(()=>{
        cy.visit('/')
    })

    it('Login Success Regular Account',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(email)
        cy.get('.input-password > .form-control').click().type(password)
        cy.get('.d-grid').click()
        cy.wait(10000)
        cy.get('.rounded-circle').should('be.visible')
        cy.get('.router-link-active > div > span').should('have.text','Dashboard')
    })
    //Negatif TestCase
    it('Login Failed Wrong Email',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(wrongEmail)
        cy.get('.input-password > .form-control').click().type(password)
        cy.get('.d-grid').click()
        cy.wait(2000)
        cy.get('.alert').should('be.visible').should('have.text', 'Kombinasi email dan password salah' )
    })
    //Negatif TestCase
    it('Login Failed Wrong Password',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(email)
        cy.get('.input-password > .form-control').click().type(wrongPassword)
        cy.get('.d-grid').click()
    })
    //Negatif TestCase
    it('Login Failed Blank email',()=>{
        cy.get('.input-password > .form-control').click().type(password)
        cy.get('.d-grid').should('not.be.enabled')
    })
    //Negatif TestCase
    it('Login Failed Blank Password',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(email)
        cy.get('.d-grid').should('not.be.enabled')
    })
    //Negatif TestCase
    it('Appear warning must be use valid email format',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(invalidEmail)
        cy.get('form > :nth-child(1) > .text-danger').should('be.visible').should('have.text','email harus email valid.')
    })
    //Negatif TestCase
    it('Appear warning email field dont blank',()=>{
        cy.get(':nth-child(1) > .form-control').click().type(invalidEmail).clear()
        cy.get('form > :nth-child(1) > .text-danger').should('be.visible').should('have.text','email tidak boleh kosong.')
    })
    //Negatif TestCase
    it('Password should hidden',()=>{
        cy.get('.input-password > .form-control').type(password).should('have.attr', 'type', 'password');
    })
    //Negatif TestCase
    it('Showwing password text if click icon eye',()=>{
        cy.get('.input-password > .form-control').type(password).should('have.attr', 'type', 'password');
        cy.get('.uil-eye').click()
        cy.get('.input-password > .form-control').should('have.attr', 'type', 'text');
    })
    
})