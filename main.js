"use strict";

const products = [
  {
    title: "Рабочая лампа на струбцине KD-312",
    price: 1148,
    priceType: "Руб.",
    description: "Рабочая лампа на струбцине KD-312 белого цвета служит для освещения рабочего места дома и в офисе.",
    properties: [
      {
        key: "width",
        text: "Ширина",
        value: 12.5,
        unit: "см",
      },
      {
        key: "height",
        text: "Высота",
        value: 41,
        unit: "см",
      },
      {
        key: "weight",
        text: "Вес",
        value: 1.449,
        unit: "кг",
      },
      {
        key: "voltage",
        text: "Напряжение",
        value: 230,
        unit: "В",
      },
      {
        key: "powerSupply",
        text: "Источник питания",
        value: "сеть",
        type: 1,
        unit: "",
      },
      {
        key: "colorTemperature",
        text: "Температура свечения",
        value: 4000,
        unit: "в К",
      },
    ],
    watts: [
      { id: 1, text: 14, unit: "wt" },
      { id: 2, text: 24, unit: "wt" },
      { id: 3, text: 34, unit: "wt" },
      { id: 4, text: 44, unit: "wt" },
      { id: 5, text: 54, unit: "wt" },
    ],
    colors: [
      { id: 1, text: "white", unit: "", img: "lamp_1_white.jpg" },
      { id: 2, text: "green", unit: "", img: "lamp_1_green.jpg" },
      { id: 3, text: "violet", unit: "", img: "lamp_1_violet.jpg" },
    ],
  },
  {
    title: "Настольная лампа светодиодная Эра LED-506-10W-W регулируемый",
    price: 997,
    priceType: "Руб.",
    description: "предназначена для установки на столе в рабочем кабинете, парте школьника. Оснащена широким и устойчивым основанием",
    properties: [
      {
        key: "width",
        text: "Ширина",
        value: 13.5,
        unit: "см",
      },
      {
        key: "height",
        text: "Высота",
        value: 43,
        unit: "см",
      },
      {
        key: "weight",
        text: "Вес",
        value: 2.449,
        unit: "кг",
      },
      {
        key: "voltage",
        text: "Напряжение",
        value: 220,
        unit: "В",
      },
      {
        key: "powerSupply",
        text: "Источник питания",
        value: "батарейки",
        type: 2,
        unit: "",
      },
      {
        key: "colorTemperature",
        text: "Температура свечения",
        value: 4000,
        unit: "в К",
      },
    ],
    watts: [
      { id: 1, text: 14, unit: "wt" },
      { id: 2, text: 24, unit: "wt" },
      { id: 3, text: 34, unit: "wt" },
    ],
    colors: [
      { id: 1, text: "white", unit: "", img: "lamp_2_white.jpg" },
      { id: 2, text: "black", unit: "", img: "lamp_2_black.jpg" },
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

  constructor(products, Product, Choice, ChoiceItem) {
    this._products = products;
    this._Product = Product;
    this._Choice = Choice;
    this._ChoiceItem = ChoiceItem;
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
    return this._products.map((product) => new this._Product(product, this._Choice, this._ChoiceItem).element);
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

/*
при нажатии на определенный color.item у нас должна передаваться соотв картинка массива
она должна отрисовываться в product
по умолчанию в продукт должна быть первая картинка
*/

class Product {
  _element = null;
  _subElements = {};
  _state = {
    favorite: false,
    watts: 0,
    colors: 0,
  };

  constructor({ title, price, priceType, description, properties, watts, colors }, Choice, ChoiceItem) {
    this._title = title;
    this._price = price;
    this._priceType = priceType;
    this._description = description;
    this._properties = properties;
    this._watts = watts;
    this._colors = colors;
    this._Choice = Choice;
    this._ChoiceItem = ChoiceItem;
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._addListener();
    this._render();
    // console.log(this._state.colors.img);
    console.log(this._colors[this._state.colors].img);
    //нужно получить
  }

  _addListener() {
    this._subElements.favorites.addEventListener("click", () => {
      this._state.favorite = !this._state.favorite;
      this._render();
    });
  }

  _render() {
    this._subElements.favorites.innerHTML = this._state.favorite ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;

    this._subElements.options.insertAdjacentElement("beforeend", new this._Choice({ title: "Watts", data: this._watts }, this._ChoiceItem).element);
    this._subElements.options.insertAdjacentElement("beforeend", new this._Choice({ title: "Colors", data: this._colors }, this._ChoiceItem).element);
  }

  getImage() {}

  _getTemplate() {
    return `
		<div class="product">
          <div class="product__image-wrapper">
            <img class="product__image" src="img/${this._colors[this._state.colors].img}" alt="img" />
          </div>
          <div class="product__favorites" data-element="favorites"></div>
          <div class="product__info">
            <div class="product__title">${this._title}</div>
            <div class="product__price">${this._price} ${this._priceType}</div>
            <div class="product__options" data-element="options"></div>
            <div class="product__description">${this._description}</div>
						<div class="product__btn">
						  <button class="btn btn--buy">Buy</button>
						</div>
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

class Choice {
  _element = null;
  _subElements = {};
  _state = {
    active: false,
    activeItem: 1,
  };

  constructor({ title, data }, ChoiceItem) {
    this._title = title;
    this._data = data;
    this._ChoiceItem = ChoiceItem;
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._addListener();
  }

  _addListener() {
    this._subElements.btn.addEventListener("click", () => {
      this._state.active = !this._state.active;
      this._render();
    });
  }

  _render() {
    if (this._state.active) {
      this._subElements.menu.classList.add("choice__menu--active");
    } else {
      this._subElements.menu.classList.remove("choice__menu--active");
    }
    this._subElements.menu.innerHTML = "";
    this._subElements.menu.append(...this._addItem());
  }

  _getId(itemId) {
    this._state.activeItem = itemId;
    this._render();
  }

  _addItem() {
    return this._data.map((el) => {
      if (this._state.activeItem === el.id) {
        return new this._ChoiceItem({ ...el, active: true }, this._getId.bind(this)).element;
      } else {
        return new this._ChoiceItem({ ...el, active: false }, this._getId.bind(this)).element;
      }
    });
  }

  _getTemplate() {
    return `
			<div class="choice">
        	<button class="btn choice__btn" data-element="btn">${this._title}</button>
          <ul class="choice__menu" data-element="menu"></ul>
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

//на листенер выделение одного элемента, передача его данных в блок choice и product

class ChoiceItem {
  _element = null;
  _subElements = {};

  constructor({ id, text, unit, img, active }, itemId) {
    this._id = id;
    this._text = text;
    this._unit = unit;
    this._img = img;
    this._active = active;
    this._itemId = itemId;
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._addListener();
  }

  _addListener() {
    this._element.addEventListener("click", (e) => {
      this._itemId(+e.target.getAttribute("data-key"));
    });
  }

  _getTemplate() {
    return `<li class="choice-item ${this._active ? "choice-item--active" : ""}" data-key="${this._id}">${this._text}${this._unit}</li>`;
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

const root = document.querySelector(".root");
root.insertAdjacentElement("afterbegin", new ProductList(products, Product, Choice, ChoiceItem).element);
