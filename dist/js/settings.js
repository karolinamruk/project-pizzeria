export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    homeWrapper: '#template-home-wrapper',
    bookingWidget: '#template-booking-widget',
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    home: '.home-wrapper',
    booking: '.booking-wrapper',
    floor: '.floor-plan',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
  },
  home: {
    homeBanner: '.home-banner',
    homeButtons: '.home-buttons a',
    openingHours: '.opening-hours',
    homeCarousel: '.carousel-cell',
    homeGallery: '.home-gallery',
    instagramLink: '.instagram-link',
    // btnOrderOnline: '.btn-order-online a',
    // btnBookTable: '.btn-book-a-table a',
  },

  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    phone: `input[name="phone"]`,
    address: `input[name="address"]`,
    starters: `input[name="starter"]`,
    form: '.booking-form',
  },
  nav: {
    links: '.main-nav a',
  },

  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice:
      '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },

  cart: {
    wrapperActive: 'active',
  },

  booking: {
    loading: 'loading',
    tableBooked: 'booked',
    tableSelected: 'selected',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 0,
    defaultMax: 10,
  }, // CODE CHANGED
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  // CODE ADDED END
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  db: {
    url:
      '//' +
      window.location.hostname +
      (window.location.hostname == 'localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    bookings: 'bookings',
    events: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
};

export const templates = {
  menuProduct: Handlebars.compile(
    document.querySelector(select.templateOf.menuProduct).innerHTML
  ),
  // CODE ADDED START
  cartProduct: Handlebars.compile(
    document.querySelector(select.templateOf.cartProduct).innerHTML
  ),
  // CODE ADDED END
  bookingWidget: Handlebars.compile(
    document.querySelector(select.templateOf.bookingWidget).innerHTML
  ),

  homeWrapper: Handlebars.compile(
    document.querySelector(select.templateOf.homeWrapper).innerHTML
  ),
};
