import { select, templates } from "../settings.js";
// import Carousel from "../components/Carousel.js";

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homeWrapper();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;

    thisHome.dom.wrapper.innerHTML = generatedHTML;

    // thisHome.dom.orderOnlineButton = thisHome.dom.wrapper.querySelector(
    //   ".btn-order-online a"
    // );
    // thisHome.dom.bookTableButton = thisHome.dom.wrapper.querySelector(
    //   ".btn-book-a-table a"
    // );

    // thisHome.dom.homeCarousel = thisHome.dom.wrapper.querySelector(
    //   select.home.homeCarousel
    // );
  }

  initWidgets() {
    const thisHome = this;

    thisHome.dom.orderOnlineButton.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.hash = "#/order";
    });

    thisHome.dom.bookTableButton.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.hash = "#booking";
    });

    // const homeCarousel = document.getElementById(select.home.homeCarousel);
    // if (homeCarousel) {
    //   new Carousel(homeCarousel);
    // }
    // thisHome.carouselElement = thisHome.dom.wrapper.querySelector('#carousel');
    // if (thisHome.carouselElement) {
    //   new Carousel(thisHome.carouselElement);
    // }
  }
}

export default Home;
