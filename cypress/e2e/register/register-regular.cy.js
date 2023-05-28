import { faker } from '@faker-js/faker';
import 'cypress-file-upload';

const randomName = faker.person.fullName();
const companyName = faker.company.name();
const randomNoRek = faker.datatype.number();
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


describe('Register Regular User', () => {
    const password = "test-password";
    let inboxId;
    let emailAddress;

    it('Full Test Register Regular User From Sign-up', () => {
        cy.visit('/');
        cy.get('.text-danger').click()
        cy.wait(1000)

        cy.createInbox().then(inbox => {
            assert.isDefined(inbox);

            inboxId = inbox.id;
            emailAddress = inbox.emailAddress;

            // Isi formulir pendaftaran dengan email yang dihasilkan
            cy.get(':nth-child(1) > .form-control').type(randomName);
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
            cy.wait(5000)
        });
    });
});