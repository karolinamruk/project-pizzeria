import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.starters = [];

    thisBooking.selectedTable = null;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);

    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    // console.log('getData params', params);

    const urls = {
      bookings:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.bookings.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);

        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }

    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      // console.log('loop', hourBlock);

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

      if (
        table.classList.contains(classNames.booking.tableBooked) &&
        thisBooking.selectedTable == tableId
      ) {
        thisBooking.selectedTable = null;
        table.classList.remove(classNames.booking.tableSelected);
      }
    }
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.booking.phone
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.booking.address
    );
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.starters
    );
    thisBooking.dom.bookingButton =
      thisBooking.dom.wrapper.querySelector('.btn-secondary');
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.wrapper.addEventListener('click', function (event) {
      event.preventDefault();
      const clickedElement = event.target.closest(select.booking.tables);

      if (clickedElement) {
        thisBooking.initTables(clickedElement);
      }
    });

    thisBooking.dom.datePicker.addEventListener('updated', function () {
      thisBooking.resetSelectedTable(); // Resetowanie wybranego stolika przy zmianie daty
      thisBooking.updateDOM();
    });
    thisBooking.dom.hourPicker.addEventListener('updated', function () {
      thisBooking.resetSelectedTable(); // Resetowanie wybranego stolika przy zmianie godziny
      thisBooking.updateDOM();
    });

    thisBooking.dom.peopleAmount.addEventListener('updated', function () {
      thisBooking.resetSelectedTable(); // Resetowanie wybranego stolika przy zmianie liczby osób
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function () {
      thisBooking.resetSelectedTable(); // Resetowanie wybranego stolika przy zmianie liczby godzin
    });

    // thisBooking.dom.wrapper.addEventListener('updated', function () {});

    thisBooking.dom.wrapper.addEventListener('change', function (event) {
      if (event.target.matches('input[type="checkbox"][name="starter"]')) {
        const starterValue = event.target.value;
        if (
          event.target.checked &&
          !thisBooking.starters.includes(starterValue)
        ) {
          thisBooking.starters.push(starterValue);
        } else if (
          !event.target.checked &&
          thisBooking.starters.includes(starterValue)
        ) {
          thisBooking.starters.splice(
            thisBooking.starters.indexOf(starterValue),
            1
          );
        }
      }
      // thisBooking.sendBooking();
      // thisBooking.updateDOM();
    });

    thisBooking.dom.phone.addEventListener('input', function (event) {
      const input = event.target.value;
      const numericInput = input.replace(/\D/g, '');
      if (input !== numericInput) {
        alert('Dozwolone tylko liczby');
        event.target.value = numericInput;
      }
    });

    thisBooking.dom.bookingButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  initTables(clickedElement) {
    const thisBooking = this;

    let tableId = clickedElement.getAttribute(
      settings.booking.tableIdAttribute
    );
    if (!isNaN(tableId)) {
      tableId = parseInt(tableId);
    }

    if (clickedElement.classList.contains(classNames.booking.tableBooked)) {
      alert('Ten stolik jest już zarezerwowany w tym terminie. Wybierz inny.');
      return;
    }

    if (thisBooking.selectedTable === tableId) {
      thisBooking.selectedTable = null; // Resetowanie wybranego stolika, jeśli ten sam stolik jest kliknięty
      clickedElement.classList.remove(classNames.booking.tableSelected);
    } else {
      if (thisBooking.selectedTable) {
        const previouslySelectedTable = thisBooking.dom.wrapper.querySelector(
          `[${settings.booking.tableIdAttribute}="${thisBooking.selectedTable}"]`
        );
        if (previouslySelectedTable) {
          previouslySelectedTable.classList.remove(
            classNames.booking.tableSelected
          ); // Usuń klasę selected z poprzednio wybranego stolika
        }
      }

      thisBooking.selectedTable = tableId; // Ustawienie nowo wybranego stolika
      clickedElement.classList.add(classNames.booking.tableSelected); // Dodanie klasy selected do nowo wybranego stolika
    }
  }

  resetSelectedTable() {
    const thisBooking = this;

    if (thisBooking.selectedTable) {
      const previouslySelectedTable = thisBooking.dom.wrapper.querySelector(
        `[${settings.booking.tableIdAttribute}="${thisBooking.selectedTable}"]`
      );
      if (previouslySelectedTable) {
        previouslySelectedTable.classList.remove(
          classNames.booking.tableSelected
        ); // Usuń klasę selected z poprzednio wybranego stolika
      }
      thisBooking.selectedTable = null; // Resetowanie wybranego stolika
    }
  }

  sendBooking() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.bookings;

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table:
        thisBooking.selectedTable !== null
          ? Number(thisBooking.selectedTable)
          : null,
      duration: Number(thisBooking.hoursAmount.value),
      ppl: Number(thisBooking.peopleAmount.value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };

    // for (let starter of thisBooking.starters) {
    //   payload.products.push(starter.getData());
    // }

    thisBooking.dom.starters.forEach((starter) => {
      if (starter.checked) {
        payload.starters.push(starter.value); // Dodaj wartość checked startera do tablicy
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then(() => {
        // Jeśli rezerwacja się powiodła, dodaj ją do thisBooking.booked
        thisBooking.makeBooked(
          payload.date,
          payload.hour,
          payload.duration,
          payload.table
        );
        thisBooking.updateDOM(); // Zaktualizuj DOM, aby odzwierciedlić nową rezerwację
      });
    console.log(payload);
  }
}

export default Booking;
