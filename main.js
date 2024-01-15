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

  constructor(products, Product, Choice, ChoiceItem, Popup) {
    this._products = products;
    this._Product = Product;
    this._Choice = Choice;
    this._ChoiceItem = ChoiceItem;
    this._Popup = Popup;
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
    return this._products.map((product) => new this._Product(product, this._Choice, this._ChoiceItem, this._Popup).element);
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
    watts: 1,
    colors: 1,
    isFirstRender: true,
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
  }

  _addListener() {
    this._subElements.favorites.addEventListener("click", () => {
      this._state.favorite = !this._state.favorite;
      this._render();
    });

    this._subElements.buy.addEventListener("click", (e) => {
      e.target.dispatchEvent(
        new CustomEvent("addToCart", {
          bubbles: true,
          detail: {
            productTitle: this._title,
          },
        })
      );
    });

    this._subElements.more.addEventListener("click", (e) => {
      e.target.dispatchEvent(
        new CustomEvent("openProperties", {
          bubbles: true,
          detail: {
            properties: this._properties,
          },
        })
      );
    });

    this._subElements.imgWrapper.addEventListener("click", (e) => {
      e.target.dispatchEvent(
        new CustomEvent("openImage", {
          bubbles: true,
          detail: {
            src: this._colors[this._state.colors - 1].img,
          },
        })
      );
    });
  }

  _render() {
    this._subElements.favorites.innerHTML = this._state.favorite ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;

    this._subElements.img.src = `img/${this._colors[this._state.colors - 1].img}`;

    if (this._watts[this._state.watts - 1]) {
      this._subElements.imgWrapper.className = `product__image-wrapper--light-${this._watts[this._state.watts - 1].text}`;
    } else {
      this._subElements.imgWrapper.className = `product__image-wrapper`;
    }

    if (this._state.isFirstRender) {
      this._subElements.options.insertAdjacentElement(
        "beforeend",
        new this._Choice({ title: "Watts", data: this._watts }, this._ChoiceItem, this._getWatt.bind(this)).element
      );
      this._subElements.options.insertAdjacentElement(
        "beforeend",
        new this._Choice({ title: "Colors", data: this._colors }, this._ChoiceItem, this._getColor.bind(this)).element
      );
    }

    if (this._state.isFirstRender) {
      this._state.isFirstRender = false;
    }
  }

  _getWatt(itemId) {
    this._state.watts = itemId;
    this._render();
  }

  _getColor(itemId) {
    this._state.colors = itemId;
    this._render();
  }

  _getTemplate() {
    return `
		<div class="product">
			<div class="product__main">
				<div class="product__more" data-element="more">
					<i class="fa-solid fa-angles-right"></i>
				</div>
				<div class="product__favorites" data-element="favorites"></div>
        <div class="product__image-wrapper" data-element="imgWrapper">
          <img class="product__image" data-element="img" src="" alt="img" />
        </div>
        <div class="product__info">
          <h4 class="product__title">${this._title}</h4>
          <span class="product__price">${this._price} ${this._priceType}</span>
          <div class="product__options" data-element="options"></div>
          <div class="product__description">${this._description}</div>
				</div>
			</div>
			<div class="product__btn" data-element="buy">
				<button class="btn btn--buy">Buy</button>
			</div>
     </div>`;
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

  constructor({ title, data }, ChoiceItem, callback) {
    this._title = title;
    this._data = data;
    this._ChoiceItem = ChoiceItem;
    this._callback = callback;
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

  _getActiveItemId(itemId) {
    this._state.activeItem = itemId;
    this._callback(itemId);
    this._render();
  }

  _addItem() {
    return this._data.map((el) => {
      if (this._state.activeItem === el.id) {
        return new this._ChoiceItem({ ...el, active: true }, this._getActiveItemId.bind(this)).element;
      } else {
        return new this._ChoiceItem({ ...el, active: false }, this._getActiveItemId.bind(this)).element;
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

class ChoiceItem {
  _element = null;
  _subElements = {};

  constructor({ id, text, unit, active }, itemId) {
    this._id = id;
    this._text = text;
    this._unit = unit;
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

class Popup {
  _element = null;
  _subElements = {};
  _state = {};

  constructor() {
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
    this._handleKeyDocument = this._handleKeyDocument.bind(this);
    this._addListeners();
  }

  _addListeners() {
    this._subElements.btn.addEventListener("click", () => this.close());

    this._element.addEventListener("click", (e) => {
      if (e.target === this._subElements.wrapper) {
        this.close();
      }
    });
  }

  _handleKeyDocument(e) {
    if (e.key === "Escape") {
      this.close();
    }
  }

  open() {
    document.addEventListener("keydown", this._handleKeyDocument);
    this._element.classList.add("popup--active");
  }

  close() {
    document.addEventListener("keydown", this._handleKeyDocument);
    this._element.classList.remove("popup--active");
  }

  _getTemplate() {
    return `it's base template. Change it.`;
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

class PopupProperties extends Popup {
  constructor(PropertyItem) {
    super();
    this._PropertyItem = PropertyItem;
  }

  _generateItems() {
    return this._state.properties.map((property) => {
      return new this._PropertyItem({ ...property }).element;
    });
  }

  _render() {
    this._subElements.list.innerHTML = "";
    this._subElements.list.append(...this._generateItems());
  }

  open(properties) {
    this._state.properties = properties;
    this._render();
    super.open();
  }

  _getTemplate() {
    return `
		<div class="popup">
      <div class="popup__wrapper" data-element="wrapper">
        <div class="popup__container" data-element="container">
					<button class="popup__btn btn--close btn" data-element="btn">x</button>
				  <h3 class="popup__title">Характеристики:</h3>
  				<div class="properties-list" data-element="list"></div>
				</div>
      </div>
    </div>
		`;
  }
}

class PropertyItem {
  _element = null;
  _subElements = {};

  constructor({ key, text, value, unit }) {
    this._key = key;
    this._text = text;
    this._value = value;
    this._unit = unit;
    this._init();
  }

  _init() {
    this._element = createElement(this._getTemplate());
    this._subElements = this._getSubElements();
  }

  _getTemplate() {
    return `
			<div class="product-property">
				<div class="product-property__icon">
					<i class="fa-solid fa-angles-right"></i>
				</div>
				<div class="product-property__info">
					<h4 class="product-property__title">${this._text}</h4>
					<span class="product-property__text">${this._value} ${this._unit}</span>
				</div>
			</div>`;
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

class PopupBuy extends Popup {
  _render(productTitle) {
    return (this._subElements.text.textContent = `Вы выбрали товар "${productTitle}", хороший выбор!`);
  }

  open(productTitle) {
    this._render(productTitle);
    super.open();
  }

  _getTemplate() {
    return `
		<div class="popup">
      <div class="popup__wrapper" data-element="wrapper">
			<div class="popup__container" data-element="container">
				<button class="popup__btn btn--close btn" data-element="btn">x</button>
				<h3 class="popup__title">Товар в корзине:</h3>
      	<p class="popup__text" data-element="text"></p>
      	<div class="popup__buttons">
        	<button class="popup__btn btn--continue btn">Продолжить покупки</button>
        	<button class="popup__btn btn--cart btn">В корзину</button>
      	</div>
			</div>
    </div>
  </div>
		`;
  }
}

class PopupImage extends Popup {
  _render(src) {
    this._subElements.img.src = `img/${src}`;
  }

  open(src) {
    this._render(src);
    super.open();
  }

  _getTemplate() {
    return `
		<div class="popup">
      <div class="popup__wrapper" data-element="wrapper">
        <div class="popup__container" data-element="container">
					<button class="popup__btn btn--close btn" data-element="btn">x</button>
				  <img class="popup__image" data-element="img" src="" alt="img" />
				</div>
      </div>
    </div>
		`;
  }
}

const root = document.querySelector(".root");
const popupBuy = new PopupBuy();
const popupProperties = new PopupProperties(PropertyItem);
const popupImage = new PopupImage();

root.addEventListener("addToCart", (e) => {
  popupBuy.open(e.detail.productTitle);
});

root.addEventListener("openProperties", (e) => {
  popupProperties.open(e.detail.properties);
});

root.addEventListener("openImage", (e) => {
  popupImage.open(e.detail.src);
});

root.insertAdjacentElement("afterbegin", new ProductList(products, Product, Choice, ChoiceItem).element);
root.insertAdjacentElement("afterbegin", popupBuy.element);
root.insertAdjacentElement("afterbegin", popupProperties.element);
root.insertAdjacentElement("afterbegin", popupImage.element);
