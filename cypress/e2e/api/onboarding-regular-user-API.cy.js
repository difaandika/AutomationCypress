describe('Test API Onboarding Regular User', ()=>{
    it('get list user',()=>{
        cy.request("get", "https://reqres.in/api/users?page=2").then((Response)=>{
            expect(Response.status).to.eq(200)
        })
    })
})
