import { templates } from "../settings.js";
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
  }

  initWidgets() {
    // const thisHome = this;
    // thisHome.dom.orderOnlineButton.addEventListener("click", function (event) {
    //   event.preventDefault();
    //   window.location.hash = "#/order";
    // });
    // thisHome.dom.bookTableButton.addEventListener("click", function (event) {
    //   event.preventDefault();
    //   window.location.hash = "#booking";
    // });
  }
}

export default Home;
