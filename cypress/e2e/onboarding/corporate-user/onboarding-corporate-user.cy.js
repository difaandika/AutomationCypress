import { faker } from '@faker-js/faker';
import 'cypress-file-upload';

const randomName = faker.person.fullName();
const companyName = faker.company.name();
const bidangUsaha = 'Bidang Usaha Kelontong'
const randomNoRek = faker.datatype.number();
const randomNoNpwp = faker.datatype.number();
const noHp = faker.phone.number('08##########');
const namaTerlaluPendek = 'aa'
const nomorTidakValid = 'abcd'
const alamat = 'Jl. Pegangsaan TimurKec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta'
const alamatShort = 'jl'

function extractVerificationLink(emailBody) {
    const regex = /<a href="(.*?)"/;
    const match = emailBody.match(regex);
    if (match && match[1]) {
        const verificationLink = match[1];
        return verificationLink;
    } else {
        throw new Error('Verification link not found in email body');
    }
}


describe('Onboarding Corporate User', () => {
    const password = "test-password";
    let inboxId;
    let emailAddress;

    it('Full Test Onboarding Corporate User From Sign-up', () => {
        cy.visit('https://sandbox-app.oexpress.co.id/corp/register',{failOnStatusCode: false});

        cy.createInbox().then(inbox => {
            assert.isDefined(inbox);

            inboxId = inbox.id;
            emailAddress = inbox.emailAddress;
            cy.get(':nth-child(1) > .form-control').type(companyName);
            cy.get('form > :nth-child(2) > .form-control').type(emailAddress);
            cy.get('.input-password > .form-control').type(password);
            cy.get(':nth-child(4) > .form-control').type(noHp);
            cy.get('.btn').click();
            cy.wait(1000)
            cy.get('.mt-0').should('have.text', 'Please Check Your Email!');

            cy.waitForLatestEmail(inboxId).then(email => {
                assert.isDefined(email);
                assert.strictEqual(/Verifikasi Akun/.test(email.body), true);
                cy.log(email.body)
            
                // Mengambil tautan dari email
                cy.wait(5000)
                const verificationLink = extractVerificationLink(email.body);
                cy.visit(verificationLink,{failOnStatusCode: false})
                // cy.contains('a href', 'Verifikasi Akun').click();
                cy.get('.mt-0').should('have.text','Verification Success!')
                cy.get('b').should('have.text', 'Log In').click()
            });

            cy.get(':nth-child(1) > .form-control').click().type(emailAddress)
            cy.get('.input-password > .form-control').click().type(password)
            cy.get('.d-grid').click()
            cy.wait(10000)

            cy.get('.modal-body > h4').should('have.text', 'OnBoarding Registrasi Member')
            cy.get('.multiselect__tags').type('Bandung')
            cy.contains('Bandung').click()

            cy.get('.row > :nth-child(1) > .form-control').type(companyName)
            cy.get(':nth-child(2) > .form-control').type(randomName)
            cy.get(':nth-child(3) > .form-control').type(bidangUsaha)
            cy.get(':nth-child(4) > .form-control').type(randomNoNpwp)
            cy.get(':nth-child(5) > .form-control').type(noHp)
            cy.get(':nth-child(6) > .form-control').type(emailAddress)
            cy.get(':nth-child(7) > .form-control').type(alamat)
            cy.get('.flex').click()

            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control')
            cy.get('form > :nth-child(1) > :nth-child(1) > :nth-child(2) > .form-control')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(3) > .form-control')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(4) > .form-control')
            cy.get('[name="working_hour.start"]')
            cy.get('[name="working_hour.end"]')
            cy.get(':nth-child(6) > .d-flex > :nth-child(1)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(2)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(3)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(4)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(5)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(6)')
            cy.get(':nth-child(6) > .d-flex > :nth-child(7)')
            cy.get(':nth-child(7) > .multiselect > .multiselect__tags')
            cy.get('[name="pickup_time.start"]')
            cy.get('[name="pickup_time.end"]')
            cy.get('#payment-type-invoicing')
            cy.get('#store-address')
            cy.get('#permission-service-0')
            cy.get('#tax-ppn')
            cy.get('.flex')
        });
    });
});

