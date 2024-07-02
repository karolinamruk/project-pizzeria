import { select, templates } from '../settings.js';
// import Carousel from '../components/Carousel.js';

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

    thisHome.dom.homeCarousel = thisHome.dom.wrapper.querySelector(
      select.home.homeCarousel
    );
  }

  initWidgets() {
    // const thisHome = this;
    // thisHome.carouselElement = thisHome.dom.wrapper.querySelector('#carousel');
    // if (thisHome.carouselElement) {
    //   new Carousel(thisHome.carouselElement);
    // }
  }
}

export default Home;
