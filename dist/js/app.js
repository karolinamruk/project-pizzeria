import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initHome() {
    const thisApp = this;

    thisApp.home = document.querySelector(select.containerOf.home);
    new Home(thisApp.home);

    thisApp.homeButtons = document.querySelectorAll(select.home.homeButtons);

    thisApp.addListeners(thisApp.homeButtons);

    // for (let link of thisApp.homeButtons) {
    //   link.addEventListener('click', function (event) {
    //     const clickedElement = this;
    //     event.preventDefault();

    //     /* get page id from href attibute */
    //     const id = clickedElement.getAttribute('href').replace('#', '');

    //     /* run thisApp.activatePage with that id */
    //     thisApp.activatePage(id);

    //     /* change URL hash */
    //     window.location.hash = '#/' + id;
    //   });
    // }
  },

  initBooking() {
    const thisApp = this;

    thisApp.booking = document.querySelector(select.containerOf.booking);
    new Booking(thisApp.booking);
  },

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    thisApp.addListeners(thisApp.navLinks);
  },

  addListeners: function (element) {
    const thisApp = this;

    for (let link of element) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attibute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links, remove from non-matching */

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      // new Product(productData, thisApp.data.products[productData]);
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        /*save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /*execute initMenu method */
        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function () {
    const thisApp = this;

    thisApp.initPages();

    thisApp.initData();

    // thisApp.initMenu();

    thisApp.initCart();
    thisApp.initHome();
    thisApp.initBooking();
  },
};

app.init();
