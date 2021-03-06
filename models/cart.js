const
  fs = require('fs'),
  path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0
      };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id),
        existingProduct = cart.products.find(prod => prod.id === id);
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct
        };
        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1
        }
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += productPrice;
      fs.writeFile(p, JSON.stringify(cart));
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      const
        updatedCart = {
          ...JSON.parse(fileContent)
        },
        product = updatedCart.products.find(prod => prod.id === id);

      if (!product) return;

      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      updatedCart.totalPrice -= productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart));
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    })
  }
}