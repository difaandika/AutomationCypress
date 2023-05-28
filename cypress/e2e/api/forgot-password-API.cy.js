describe('Uji API Reset Password Anggota', () => {
  let resetToken;

  it('seharusnya memberikan respons error jika email tidak terdaftar saat mengirim permintaan reset password', () => {
    cy.request({
      method: 'POST',
      url: 'https://sandbox.api.oexpress.co.id/auth/member/password/reset',
      body: {
        email: 'nonexistent@example.com', // Email yang tidak terdaftar
      },
      failOnStatusCode: false, // Mengizinkan respons tidak sukses
    }).then((response) => {
      // Memastikan respons memiliki status tidak sukses (tidak 200)
      expect(response.status).to.not.eq(200);

      // Memastikan respons berisi pesan error yang sesuai
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.be.a('string');
      expect(response.body.error).to.include('tidak terdaftar');
    });
  });

  it('seharusnya dapat mengirim email reset password ke anggota yang terdaftar', () => {
    cy.request({
      method: 'POST',
      url: 'https://sandbox.api.oexpress.co.id/auth/member/register',
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      },
    }).then(() => {
      // Mendaftarkan anggota baru sebelum mengirim permintaan reset password

      cy.request({
        method: 'POST',
        url: 'https://sandbox.api.oexpress.co.id/auth/member/password/reset',
        body: {
          email: 'johndoe@example.com',
        },
      }).then((response) => {
        // Memastikan respons memiliki status 200
        expect(response.status).to.eq(200);

        // Memastikan respons berisi data token reset
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('resetToken');
        resetToken = response.body.data.resetToken;
      });
    });
  });

  it('seharusnya memberikan respons error jika token reset tidak valid saat melakukan reset password', () => {
    const invalidResetToken = 'invalidtoken123'; // Token reset tidak valid

    cy.request({
      method: 'POST',
      url: 'https://sandbox.api.oexpress.co.id/auth/member/password/reset',
      body: {
        resetToken: invalidResetToken,
        password: 'newpassword123',
      },
      failOnStatusCode: false, // Mengizinkan respons tidak sukses
    }).then((response) => {
      // Memastikan respons memiliki status tidak sukses (tidak 200)
      expect(response.status).to.not.eq(200);

      // Memastikan respons berisi pesan error yang sesuai
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.be.a('string');
      expect(response.body.error).to.include('tidak valid');
    });
  });

  it('seharusnya dapat mereset password anggota dengan sukses', () => {
    cy.request({
      method: 'POST',
      url: 'https://sandbox.api.oexpress.co.id/auth/member/password/reset',
      body: {
        resetToken: resetToken,
        password: 'newpassword123',
      },
    }).then((response) => {
      // Memastikan respons memiliki status 200
      expect(response.status).to.eq(200);

      // Memastikan respons berisi data sukses reset password
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.include('berhasil diubah');
    });
  });
});
