"use strict";

const products = [
  {
    title: "Настольная лампа",
    price: 1244,
    priceType: "Руб.",
    description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio ratione labore enim quisquam, illum quia! Lorem ipsum dolor sit amet",
    watts: [
      { id: 1, text: 14, unit: "wt" },
      { id: 2, text: 24, unit: "wt" },
      { id: 3, text: 34, unit: "wt" },
      { id: 4, text: 44, unit: "wt" },
      { id: 5, text: 54, unit: "wt" },
      { id: 6, text: 64, unit: "wt" },
      { id: 7, text: 74, unit: "wt" },
    ],
    colors: [
      { id: 1, text: "white", unit: "", img: "lamp_1_white.jpg" },
      { id: 2, text: "green", unit: "", img: "lamp_1_green.jpg" },
      { id: 3, text: "violet", unit: "", img: "lamp_1_violet.jpg" },
    ],
  },
];

function createElement(html) {
  const root = document.createElement("div");
  root.insertAdjacentHTML("beforeend", html);
  return root.firstElementChild;
}

class ProductList {
  _element = null;
  _subElements = {};

  constructor({ parent, products, Product }) {
    this._parent = parent;
    this._products = products;
    this._Product = Product;
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._render();
  }

  _render() {
    return this._element.append(...this._addProduct());
  }

  _addProduct() {
    return this._products.map((product) => new this._Product(product).element);
  }

  _getTemplate() {
    return `<div class="product-list"></div>`;
  }

  get element() {
    return this._element;
  }

  _getSubElements() {
    return Array.from(this._element.querySelectorAll("[data-element]")).reduce((el, acc) => {
      return {
        ...acc,
        [el.getAttribute("data-element")]: el,
      };
    }, {});
  }
}

class Product {
  _element = null;
  _subElements = {};
  _state = {
    favorite: false,
    watts: 1,
    colors: 1,
  };

  constructor({ title, price, priceType, description, watts, colors }) {
    this._title = title;
    this._price = price;
    this._priceType = priceType;
    this._description = description;
    this._watts = watts;
    this._colors = colors;

    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._addListener();
    this._render();
  }

  _addListener() {
    this._subElements.favorites.addEventListener("click", () => {
      this._state.favorite = !this._state.favorite;
      this._render();
    });
  }

  _render() {
    this._subElements.favorites.innerHTML = this._state.favorite ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;
  }

  _getTemplate() {
    return `
		<div class="product">
          <div class="product__image-wrapper">
            <img class="product__image" src="" alt="img" />
          </div>
          <div class="product__favorites" data-element="favorites"></div>
          <div class="product__info">
            <div class="product__title">${this._title}</div>
            <div class="product__price">${this._price} ${this._priceType}</div>
            <div class="product__options">
              <div class="choice">
                <button class="btn choice__btn"></button>
                <ul class="choice__menu">
                  <li class="choice-item"></li>
                </ul>
              </div>
              <div class="choice">
                <button class="btn choice__btn"></button>
                <ul class="choice__menu">
                  <li class="choice-item"></li>
                </ul>
              </div>
            </div>
            <div class="product__description">${this._description}</div>
            <button class="btn product__btn btn--buy">Buy</button>
          </div>
        </div>
		`;
  }

  get element() {
    return this._element;
  }

  _getSubElements() {
    return Array.from(this._element.querySelectorAll("[data-element]")).reduce((acc, el) => {
      return {
        ...acc,
        [el.getAttribute("data-element")]: el,
      };
    }, {});
  }
}

const productList = new ProductList({
  parent: "body",
  products,
  Product,
});

const root = document.querySelector(".root");
root.insertAdjacentElement("afterbegin", productList.element);
