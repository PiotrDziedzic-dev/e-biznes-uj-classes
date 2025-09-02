const parseBody = (body) => {
  try {
    return typeof body === 'string' ? JSON.parse(body) : body;
  } catch (e) {
    return body;
  }
};

describe('API – Products CRUD', () => {
  const api = Cypress.env('apiBase');

  it('GET /api/products returns array', () => {
    cy.request(`${api}/products`).then((res) => {
      const data = parseBody(res.body);
      expect(res.status).to.eq(200);
      expect(data).to.be.an('array');
      expect(data.length).to.be.greaterThan(0);
      const p = data[0];
      expect(p).to.have.all.keys('id','name','price','category');
    });
  });

  it('POST /api/products creates product', () => {
    const payload = { name: 'Cypress Mouse', price: 49.99, category: 'Accessories' };
    cy.request('POST', `${api}/products`, payload).then((res) => {
      const body = parseBody(res.body);
      expect(res.status).to.be.oneOf([200,201]);
      expect(body).to.include(payload);
      expect(body.id).to.be.a('number');
    });
  });

  it('PUT /api/products/{id} updates product', () => {
    const create = { name: 'Temp Item', price: 10.5, category: 'Temp' };
    cy.request('POST', `${api}/products`, create).its('body').then((raw) => {
      const created = parseBody(raw);
      const update = { ...created, name: 'Temp Item Updated', price: 12.0 };
      cy.request('PUT', `${api}/products/${created.id}`, update).then((res) => {
        const body = parseBody(res.body);
        expect(res.status).to.eq(200);
        expect(body.name).to.eq('Temp Item Updated');
        expect(body.price).to.eq(12.0);
      });
    });
  });

  it('DELETE /api/products/{id} deletes product', () => {
    const create = { name: 'Temp To Delete', price: 1.0, category: 'Tmp' };
    cy.request('POST', `${api}/products`, create).its('body').then((raw) => {
      const created = parseBody(raw);
      cy.request({method:'DELETE', url:`${api}/products/${created.id}`, failOnStatusCode:false}).then((res) => {
        expect([200,204]).to.include(res.status);
      });
      // verify it is gone
      cy.request({url:`${api}/products`, failOnStatusCode:false}).then((res) => {
        const list = parseBody(res.body);
        const exists = Array.isArray(list) ? list.find(p => p.id === created.id) : undefined;
        expect(exists).to.be.undefined;
      });
    });
  });

  // Negative scenarios (aligned with current backend behavior)
  it('POST with empty body does not crash and returns created or 4xx', () => {
    cy.request({method:'POST', url:`${api}/products`, body:{}, failOnStatusCode:false}).then((res) => {
      // Backend bez walidacji zwykle zwraca 200/201 i tworzy pusty produkt.
      expect([200,201,400,422]).to.include(res.status);
      const body = parseBody(res.body);
      // Jeśli utworzył, sprawdź że ma id i pola (mogą być puste)
      if (res.status === 200 || res.status === 201) {
        expect(body).to.have.property('id');
        expect(body).to.have.keys('id','name','price','category');
      }
    });
  });

  it('PUT non-existing id returns 404', () => {
    cy.request({method:'PUT', url:`${api}/products/999999`, body:{name:'X',price:1,category:'Y'}, failOnStatusCode:false}).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  it('DELETE non-existing id returns 404', () => {
    cy.request({method:'DELETE', url:`${api}/products/999999`, failOnStatusCode:false}).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
