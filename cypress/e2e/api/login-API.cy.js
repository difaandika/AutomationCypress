describe('Test API Login Page', ()=>{
    it('get list user',()=>{
        cy.request("get", "https://sandbox.api.oexpress.co.id/auth/member/login").then((Response)=>{
            expect(Response.status).to.eq(200)
        })
    })
})
