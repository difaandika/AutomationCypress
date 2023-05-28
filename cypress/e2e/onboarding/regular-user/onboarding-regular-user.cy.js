
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

describe('Onboarding Regular User', () => {
    const password = "test-password";
    let inboxId;
    let emailAddress;

    it('Full Test Onboarding Regular User From Sign-up', () => {
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

            cy.get('.mb-4').should('have.text','Informasi Toko')
            cy.get('.text-center > h3').contains('Selamat Datang,')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').type(companyName).clear()
            cy.get('form > :nth-child(1) > :nth-child(1) > :nth-child(1) > .text-danger').should('have.text','Nama Penjual atau Toko tidak boleh kosong.')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').type(namaTerlaluPendek)
            cy.get('form > :nth-child(1) > :nth-child(1) > :nth-child(1) > .text-danger').should('have.text','Nama Penjual atau Toko terlalu pendek.')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').clear().type(companyName)

            cy.get(':nth-child(2) > .form-control').type(randomName).clear()
            cy.get(':nth-child(2) > .text-danger').should('have.text','Nama Penanggung Jawab tidak boleh kosong.')
            cy.get(':nth-child(2) > .form-control').type(namaTerlaluPendek)
            cy.get(':nth-child(2) > .text-danger').should('have.text','Nama Penanggung Jawab terlalu pendek.')
            cy.get(':nth-child(2) > .form-control').clear().type(randomName)

            cy.get(':nth-child(2) > .col-md-6 > .form-control').type(noHp).clear()
            cy.get(':nth-child(2) > .col-md-6 > .text-danger').should('have.text','Nomor Telepon tidak boleh kosong.')
            cy.get(':nth-child(2) > .col-md-6 > .form-control').type(nomorTidakValid)
            cy.get(':nth-child(2) > .col-md-6 > .text-danger').should('have.text','No. Handphone tidak valid, Eg. 08123456789')
            cy.get(':nth-child(2) > .col-md-6 > .form-control').clear().type(noHp)

            cy.get(':nth-child(3) > .col-md-12 > .form-control').type(alamat).clear()
            cy.get(':nth-child(3) > .col-md-12 > .text-danger').should('have.text','Alamat tidak boleh kosong.')
            cy.get(':nth-child(3) > .col-md-12 > .form-control').type(alamatShort)
            cy.get(':nth-child(3) > .col-md-12 > .text-danger').should('have.text','Alamat terlalu pendek.')
            cy.get(':nth-child(3) > .col-md-12 > .form-control').clear().type(alamat)

            cy.get('.multiselect__tags').type('Bandung').clear()
            cy.get(':nth-child(4) > .col-md-12 > .text-danger').should('have.text','Lokasi Kota / Kecamatan tidak boleh kosong.')
            cy.get('.multiselect__tags').clear().type('Bandung')
            cy.contains('Bandung').click()

            cy.get('.onboarding-process > :nth-child(1)').should('have.text', '1 dari 4')
            cy.get('.flex > .btn').click()
            cy.wait(2000)

            cy.get('.mb-4').should('have.text', 'Informasi Pickup')
            cy.get('#store-address').click() 
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').should('not.have.value', '')
            cy.get(':nth-child(2) > .form-control').should('not.have.value', '')
            cy.get(':nth-child(2) > .col-md-6 > .form-control').should('not.have.value', '')
            cy.get(':nth-child(3) > .col-md-12 > .form-control').should('not.have.value', '')

            cy.get('#store-address').click()

            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').type(randomName).clear()
            cy.get('form > :nth-child(1) > :nth-child(1) > :nth-child(1) > .text-danger').should('have.text','Nama Penanggung Jawab tidak boleh kosong.')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').type(namaTerlaluPendek)
            cy.get('form > :nth-child(1) > :nth-child(1) > :nth-child(1) > .text-danger').should('have.text','Nama Penanggung Jawab terlalu pendek.')
            cy.get(':nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control').clear().type(randomName)

            cy.get(':nth-child(2) > .form-control').type(randomName).clear()
            cy.get(':nth-child(2) > .text-danger').should('have.text','Nama Penanggung Jawab tidak boleh kosong.')
            cy.get(':nth-child(2) > .form-control').type(namaTerlaluPendek)
            cy.get(':nth-child(2) > .text-danger').should('have.text','Nama Penanggung Jawab terlalu pendek.')
            cy.get(':nth-child(2) > .form-control').clear().type(randomName)

            cy.get(':nth-child(2) > .col-md-6 > .form-control').type(noHp).clear()
            cy.get(':nth-child(2) > .col-md-6 > .text-danger').should('have.text','Nomor Telepon tidak boleh kosong.')
            cy.get(':nth-child(2) > .col-md-6 > .form-control').type(nomorTidakValid)
            cy.get(':nth-child(2) > .col-md-6 > .text-danger').should('have.text','No. Handphone tidak valid, Eg. 08123456789')
            cy.get(':nth-child(2) > .col-md-6 > .form-control').clear().type(noHp)

            cy.get(':nth-child(3) > .col-md-12 > .form-control').type(alamat).clear()
            cy.get(':nth-child(3) > .col-md-12 > .text-danger').should('have.text','Alamat tidak boleh kosong.')
            cy.get(':nth-child(3) > .col-md-12 > .form-control').type(alamatShort)
            cy.get(':nth-child(3) > .col-md-12 > .text-danger').should('have.text','Alamat terlalu pendek.')
            cy.get(':nth-child(3) > .col-md-12 > .form-control').clear().type(alamat)

            cy.get('.multiselect__tags').type('Bandung').clear()
            cy.get(':nth-child(4) > .col-md-12 > .text-danger').should('have.text','Lokasi Kota / Kecamatan tidak boleh kosong.')
            cy.get('.multiselect__tags').clear().type('Bandung')
            cy.contains('Bandung').click()
        
            cy.get('.onboarding-process > :nth-child(1)').should('have.text', '2 dari 4')

            cy.get('.flex > .btn').click()

            cy.get('.mb-4').should('have.text', 'Akun Bank')
            cy.get('.multiselect__tags').click()
            cy.contains('BCA').click()

            cy.get('.row > :nth-child(2) > .form-control').type(randomNoRek).clear()
            cy.get('[role="alert"]').should('have.text', 'Nomor Rekening tidak boleh kosong.')
            cy.get('.row > :nth-child(2) > .form-control').type(namaTerlaluPendek)
            cy.get('[role="alert"]').should('have.text', 'Nomor Rekening harus numerik.')
            cy.get('.row > :nth-child(2) > .form-control').clear().type(randomNoRek)
            
            cy.get(':nth-child(3) > .mb-3 > .form-control').type(randomName)
            
            cy.get('.onboarding-process > :nth-child(1)').should('have.text', '3 dari 4')
            cy.get('.flex > .btn').click()

            cy.get('h4').should('have.text','Verifikasi Diri')
            cy.get('.onboarding-process > :nth-child(1)').should('have.text', '4 dari 4')
            // const fileName='../images/ktp.jpg'
            cy.get('.dnd-uploader').selectFile('cypress/images/ktp.jpg', {
                action: 'drag-drop'
            })
            cy.get('.flex > .btn').click()
        });
    });
});


