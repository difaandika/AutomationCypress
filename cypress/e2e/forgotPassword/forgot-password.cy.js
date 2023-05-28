
import { faker } from '@faker-js/faker';
import 'cypress-file-upload';
import { MatchOptionFieldEnum, MatchOptionShouldEnum, MatchOptionsFromJSON } from 'mailslurp-client';

const randomName = faker.person.fullName();
const noHp = faker.phone.number('08##########');


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


describe('Forgot Password', () => {
    const password = "test-password";
    let inboxId;
    let emailAddress;

    it('Full Forgot Password From Sign-up', () => {
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

            cy.get('small').click()
            cy.get('.mt-0').should('have.text','Reset Password')
            cy.get('.form-control').type(emailAddress)
            cy.get('.btn').click()
            cy.get('.alert').should('have.text',' Kami sudah mengirimkan link untuk reset password Anda. Tolong cek email Anda! ')

            // cy.waitForMatchingEmails(
            //     inboxId, 
            //     MatchOptionsFromJSON({matches:[{field:MatchOptionFieldEnum.SUBJECT, should:MatchOptionShouldEnum.CONTAIN, value:'Reset Password'}]}) ,
            //     1 ).then(email => {
            //         cy.log(email)
            //         assert.isDefined(email);
            cy.waitForLatestEmail(inboxId, null, true).then(email => {
                cy.log(email)
                assert.isDefined(email);
                assert.strictEqual(/Reset Password/.test(email.body), true);
                cy.log(email.body)
                // assert.strictEqual(/Reset Password/.test(email.subject), true);
                // assert.strictEqual(new RegExp('untuk membuat password baru anda atau klik tombol Reset Password di bawah', 'gi').test(email.body), true);
                // cy.log(email.body)
            
                // // Mengambil tautan dari email
                // cy.wait(5000)
                const resetPasswordLink = extractVerificationLink(email.body);
                cy.visit(resetPasswordLink, { failOnStatusCode: false });
            });
            cy.get('.mt-0').should('have.text','Create New Password')
            cy.get(':nth-child(1) > .form-control').type(password)
            cy.get(':nth-child(2) > .form-control').type(password)
            cy.get('.btn').click()

            cy.get('.mt-0').should('have.text','Password Anda sudah diganti!')
            cy.get('.text-danger').click()

            cy.get(':nth-child(1) > .form-control').click().type(emailAddress)
            cy.get('.input-password > .form-control').click().type(password)
            cy.get('.d-grid').click()
        });
    });
});