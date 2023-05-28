describe('Uji API Pendaftaran Anggota', () => {
    let memberId;

    it('seharusnya dapat mendaftar sebagai anggota dengan sukses', () => {
        cy.request({
        method: 'POST',
        url: 'https://sandbox.api.oexpress.co.id/auth/member/register',
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        },
        }).then((response) => {
        // Memastikan respons memiliki status 200
        expect(response.status).to.eq(200);

        // Memastikan respons berisi data anggota yang berhasil terdaftar
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('memberId');
        memberId = response.body.data.memberId;
        });
    });

    it('seharusnya memberikan respons error jika data pendaftaran tidak valid', () => {
        cy.request({
        method: 'POST',
        url: 'https://sandbox.api.oexpress.co.id/auth/member/register',
        body: {
            name: '', // Nama kosong
            email: 'johndoe@example.com',
            password: 'password123',
        },
        failOnStatusCode: false, // Mengizinkan respons tidak sukses
        }).then((response) => {
        // Memastikan respons memiliki status tidak sukses (tidak 200)
        expect(response.status).to.not.eq(200);

        // Memastikan respons berisi pesan error yang sesuai
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.have.property('message');
        expect(response.body.error.message).to.be.a('string');
        });
    });

    it('seharusnya memberikan respons error jika email anggota sudah terdaftar', () => {
        cy.request({
        method: 'POST',
        url: 'https://sandbox.api.oexpress.co.id/auth/member/register',
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        },
        }).then(() => {
        // Mencoba mendaftar lagi dengan email yang sama
        cy.request({
            method: 'POST',
            url: 'https://sandbox.api.oexpress.co.id/auth/member/register',
            body: {
            name: 'Jane Smith',
            email: 'johndoe@example.com', // Email yang sudah terdaftar sebelumnya
            password: 'password456',
            },
            failOnStatusCode: false, // Mengizinkan respons tidak sukses
        }).then((response) => {
            // Memastikan respons memiliki status tidak sukses (tidak 200)
            expect(response.status).to.not.eq(200);

            // Memastikan respons berisi pesan error yang sesuai
            expect(response.body).to.have.property('error');
            expect(response.body.error).to.have.property('message');
            expect(response.body.error.message).to.be.a('string');
            expect(response.body.error.message).to.include('sudah terdaftar');
        });
        });
    });

    it('seharusnya dapat mengambil data anggota dengan ID yang valid', () => {
        cy.request({
        method: 'GET',
        url: `https://sandbox.api.oexpress.co.id/auth/member/${memberId}`,
        }).then((response) => {
        // Memastikan respons memiliki status 200
        expect(response.status).to.eq(200);

        // Memastikan respons berisi data anggota yang sesuai dengan ID yang valid
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('memberId', memberId);
        expect(response.body.data).to.have.property('name', 'John Doe');
        expect(response.body.data).to.have.property('email', 'johndoe@example.com');
        });
    });

    it('seharusnya memberikan respons error jika mencoba mengambil data anggota dengan ID yang tidak valid', () => {
        const invalidMemberId = '1234567890'; // ID yang tidak valid

        cy.request({
        method: 'GET',
        url: `https://sandbox.api.oexpress.co.id/auth/member/${invalidMemberId}`,
        failOnStatusCode: false, // Mengizinkan respons tidak sukses
        }).then((response) => {
        // Memastikan respons memiliki status tidak sukses (tidak 200)
        expect(response.status).to.not.eq(200);

        // Memastikan respons berisi pesan error yang sesuai
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.have.property('message');
        expect(response.body.error.message).to.be.a('string');
        expect(response.body.error.message).to.include('tidak ditemukan');
        });
    });

    after(() => {
        // Membersihkan kondisi setelah pengujian selesai
        cy.request({
        method: 'DELETE',
        url: 'https://sandbox.api.oexpress.co.id/auth/member',
        body: {
            email: 'johndoe@example.com',
        },
        });
    });
});
