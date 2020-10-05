import StaysView from "./staysView";

export default class AppView {
  constructor(modal) {
    this.modal = modal;
    this.stays = this.modal.data;
    this.cities = this.modal.cities;

    // Initialize the stays view
    this.StaysView = new StaysView(this.modal);

    /* DOM Elements */
    this.modalContainer = document.querySelector("#myModal");
    this.searchBtns = document.querySelectorAll(".btn__search");

    // Elements of Header Search
    this.headerSearch = document.querySelector(".header__search");
    this.showSearchCity = document.querySelector(".search__city");
    this.showSearchGuests = document.querySelector(".search__guests");

    // Main Elements of Location Search (Overlay)
    this.overlayContainer = document.querySelector(".overlay");
    this.overlayResultsContainer = document.querySelector(".overlay__results");
    this.overlayCloseIcon = document.getElementById("overlay-close");
    this.searchLocation = document.querySelector(".osearch__location");
    this.searchLocationInput = document.getElementById("searchCity");
    this.searchLocationCloseIcon = document.querySelector(
      ".searchLocationCloseIcon"
    );
    this.renderedLocations = this.renderLocationResults(this.cities);

    // Main Elements of No. of guests Search (Overlay)
    this.searchGuests = document.querySelector(".osearch__guests");
    this.searchGuestsCloseIcon = document.querySelector(
      ".searchGuestsCloseIcon"
    );
    this.adultCount = this.childrenCount = this.babiesCount = 0;
    this.formGuestsDOM = document.querySelector(".form__guests");
    this.guestResultsContainer = document.querySelector(".guest__results");
    this.totalNoOfGuestsDOM = document.getElementById("searchNoOfGuests");
    this.adultCountDOM = document.querySelector(".adult__count");
    this.childrenCountDOM = document.querySelector(".children__count");
    this.babiesCountDOM = document.querySelector(".babies__count");
    this.guestsIncButton = document.querySelectorAll(".btn__plus");
    this.guestsDecButton = document.querySelectorAll(".btn__minus");

    // Method calls
    this.events();
    // this.processSearch();
  }

  // Methods
  events() {
    // Initial form reset
    this.searchLocationInput.value = "";

    /* Search location related events */

    // Show the overlay
    this.headerSearch.addEventListener("click", (e) => {
      this.modalContainer.style.display = "block";
    });

    // Hide the overlay
    this.overlayCloseIcon.addEventListener("click", () => {
      this.modalContainer.style.display = "none";
    });

    // Anywhere on the modal if clicked, hide the overlay
    this.modalContainer.addEventListener("click", (e) => {
      if (e.target === this.modalContainer) {
        this.modalContainer.style.display = "none";
      }
    });

    // Show the location results
    this.searchLocation.addEventListener("focusin", (e) => {
      this.searchLocationInput.focus();
      // First hide the guest results with icon and remove the border
      this.guestResultsContainer.style.display = "none";
      this.searchGuestsCloseIcon.style.visibility = "hidden";
      this.searchGuests.classList.remove("apply-border-on-focus");

      // Show the search close icon
      this.searchLocationCloseIcon.style.visibility = "visible";
      if (this.overlayResultsContainer.children.length === 1) {
        this.overlayResultsContainer.prepend(this.renderedLocations);
      } else {
        if (this.overlayLocationResults) {
          this.overlayLocationResults.style.display = "flex";
        }
      }
    });

    // Re-render the location results on resetting the form
    this.searchLocationCloseIcon.addEventListener("click", () => {
      // Reset the input value
      this.searchLocationInput.value = "";

      // Re-render the location results
      this.overlayResultsContainer.removeChild(
        this.overlayResultsContainer.childNodes[0]
      );
      this.overlayResultsContainer.prepend(this.renderedLocations);
    });

    // Hide the location results and guest results
    this.overlayContainer.addEventListener("click", (e) => {
      if (
        e.target.closest(".overlay") &&
        !e.target.closest(".osearch__location")
      ) {
        this.overlayLocationResults = document.querySelector(
          ".location__results"
        );
        if (
          this.searchLocationInput != document.activeElement &&
          this.overlayLocationResults
        ) {
          this.overlayLocationResults.style.display = "none";
          this.searchLocationCloseIcon.style.visibility = "hidden";
        }
      }

      if (
        e.target.closest(".overlay") &&
        !e.target.closest(".osearch__guests") &&
        !e.target.closest(".guest__results")
      ) {
        this.guestResultsContainer.style.display = "none";
        this.searchGuestsCloseIcon.style.visibility = "hidden";
        this.searchGuests.classList.remove("apply-border-on-focus");
      }
    });

    // Input filterting
    this.searchLocationInput.addEventListener("keyup", (e) => {
      let cities = this.cities.filter((city) => {
        let cityLower = city.toLowerCase();
        return cityLower.includes(e.target.value.toLowerCase());
      });
      // Re-render the location results
      this.overlayResultsContainer.removeChild(
        this.overlayResultsContainer.childNodes[0]
      );
      if (cities.length === 0 && e.target.value === "") {
        this.overlayResultsContainer.prepend(
          this.renderLocationResults(this.cities)
        );
      } else {
        this.overlayResultsContainer.prepend(
          this.renderLocationResults(cities)
        );
      }
    });

    /* Search no of guests events*/
    this.searchGuests.addEventListener("click", (e) => {
      this.searchGuestsCloseIcon.style.fill = "#333";
      if (this.overlayResultsContainer.children.length == 1) {
        this.guestResultsContainer.style.display = "flex";
        this.searchGuestsCloseIcon.style.visibility = "visible";
      } else {
        this.guestResultsContainer.style.display = "flex";
        this.searchGuestsCloseIcon.style.visibility = "visible";
      }
    });

    // Resetting all the guests on click of guests close icon
    this.searchGuestsCloseIcon.addEventListener("click", () => {
      // Firstly resetting the counts
      this.adultCount = 0;
      this.childrenCount = 0;
      this.babiesCount = 0;
      // Resetting the DOM
      this.adultCountDOM.textContent = "0";
      this.childrenCountDOM.textContent = "0";
      this.babiesCountDOM.textContent = "0";
      this.totalNoOfGuestsDOM.textContent = "Add guests";
    });

    // Events for incrementing the no of guests
    this.guestsIncButton.forEach((incButton) => {
      incButton.addEventListener("click", (e) => {
        let target = e.target;
        // Increase count of guests (Adults)
        if (target.closest(".adult__inc")) {
          this.adultCount = parseInt(this.adultCountDOM.textContent);
          this.childrenCount = parseInt(this.childrenCountDOM.textContent);
          this.babiesCount = parseInt(this.babiesCountDOM.textContent);
          this.adultCount++;
          this.adultCountDOM.textContent = this.adultCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }
        // Increase count of guests (Children)
        else if (target.closest(".children__inc")) {
          this.childrenCount = parseInt(this.childrenCountDOM.textContent);
          this.adultCount = parseInt(this.adultCountDOM.textContent);
          this.babiesCount = parseInt(this.babiesCountDOM.textContent);
          this.childrenCount++;
          this.childrenCountDOM.textContent = this.childrenCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }
        // Increase count of guests (Babies)
        else if (target.closest(".babies__inc")) {
          this.babiesCount = parseInt(this.babiesCountDOM.textContent);
          this.childrenCount = parseInt(this.childrenCountDOM.textContent);
          this.adultCount = parseInt(this.adultCountDOM.textContent);

          this.babiesCount++;
          this.babiesCountDOM.textContent = this.babiesCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }

        // For highlighting the search guests panel
        if (
          this.adultCount + this.childrenCount + this.babiesCount >= 0 &&
          !this.searchGuests.classList.contains("apply-border-on-focus")
        ) {
          this.searchGuests.classList.add("apply-border-on-focus");
        }
      });
    });

    // Events for decrementing the no of guests
    this.guestsDecButton.forEach((decButton) => {
      decButton.addEventListener("click", (e) => {
        let target = e.target;
        // Decrease count of guests (Adults)
        if (target.closest(".adult__dec") && this.adultCount) {
          this.adultCount--;
          this.adultCountDOM.textContent = this.adultCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }
        // Decrease count of guests (Children)
        else if (target.closest(".children__dec") && this.childrenCount) {
          this.childrenCount--;
          this.childrenCountDOM.textContent = this.childrenCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }
        // Decrease count of guests (Babies)
        else if (target.closest(".babies__dec") && this.babiesCount) {
          this.babiesCount--;
          this.babiesCountDOM.textContent = this.babiesCount;
          this.totalNoOfGuestsDOM.textContent = this.renderTotalCounts(
            this.adultCount,
            this.childrenCount,
            this.babiesCount
          );
        }

        // For highlighting the search guests panel
        if (
          this.adultCount + this.childrenCount + this.babiesCount >= 0 &&
          !this.searchGuests.classList.contains("apply-border-on-focus")
        ) {
          this.searchGuests.classList.add("apply-border-on-focus");
        }
      });
    });
  }

  initSearch() {
    if (
      this.searchLocationInput.value != "" &&
      this.cities.includes(this.searchLocationInput.value) &&
      this.adultCount + this.childrenCount + this.babiesCount === 0
    ) {
      // First close the overlay
      this.modalContainer.style.display = "none";
      // Display the search values on the header
      this.showSearchCity.textContent = `${this.searchLocationInput.value}, Finland`;
      this.showSearchGuests.textContent = "Add guests";

      return [this.searchLocationInput.value, null];
    } else if (
      this.searchLocationInput.value == "" &&
      this.adultCount + this.childrenCount + this.babiesCount > 0
    ) {
      // First close the overlay
      this.modalContainer.style.display = "none";
      // Display the search values on the header
      this.showSearchGuests.textContent = this.totalNoOfGuestsDOM.textContent;
      this.showSearchCity.textContent = "Where do you travel";

      return [null, this.adultCount + this.childrenCount + this.babiesCount];
    } else if (
      this.searchLocationInput.value != "" &&
      this.adultCount + this.childrenCount + this.babiesCount > 0
    ) {
      // First close the overlay
      this.modalContainer.style.display = "none";
      // Display the search values on the header
      this.showSearchCity.textContent = `${this.searchLocationInput.value}, Finland`;
      this.showSearchGuests.textContent = this.totalNoOfGuestsDOM.textContent;

      return [
        this.searchLocationInput.value,
        this.adultCount + this.childrenCount + this.babiesCount,
      ];
    }
    // Reset the form
    this.searchLocationInput.value = "";
    // Hide the overlay and returns nulls to reset the search
    this.modalContainer.style.display = "none";
    // Reset the search values if values were entered and deleted
    this.showSearchCity.textContent = "Where do you travel";
    this.showSearchGuests.textContent = "Add guests";
    return [null, null];
  }

  processSearch(stays) {
    this.StaysView.init(stays);
  }

  renderLocationResults(cities) {
    let mobileScreen = window.matchMedia("(max-width: 608px)");
    let smallMobileScreen = window.matchMedia("(max-width: 450px)");
    if (cities.length) {
      // Create div for location results
      this.locationResults = document.createElement("div");
      this.locationResults.setAttribute("class", "location__results");

      if (mobileScreen.matches && cities.length == 1) {
        this.locationResults.style.marginTop = "-50rem";
      }
      if (smallMobileScreen.matches && cities.length == 1) {
        this.locationResults.style.marginTop = "-62rem";
      }

      // Append individual results to the locationResults
      cities.forEach((city) => {
        this.locationResults.insertAdjacentHTML(
          "beforeend",
          this.getLocationsHTML(city)
        );
      });

      this.locationResults.addEventListener("click", (e) => {
        this.searchLocationInput.focus();
        // Filter and render only current city
        let city = e.target.closest(".location__result").dataset.city;
        let cities = this.cities.filter((item) => city == item);
        // Re-render the location results
        this.overlayResultsContainer.removeChild(
          this.overlayResultsContainer.childNodes[0]
        );
        this.overlayResultsContainer.prepend(
          this.renderLocationResults(cities)
        );
        // Add to the input
        this.searchLocationInput.value = city;
      });

      // Return all the location results container to main overlay results
      return this.locationResults;
    }

    /* If cities are empty */

    // Create div for location results
    this.locationResults = document.createElement("div");
    this.locationResults.setAttribute("class", "location__results");

    if (mobileScreen.matches) {
      this.locationResults.style.marginTop = "-60rem";
    }
    if (smallMobileScreen.matches) {
      this.locationResults.style.marginTop = "-74rem";
    }

    this.locationResults.insertAdjacentHTML(
      "beforeend",
      `
      <h3 class="no-search-found">No travel locations found</h3>
    `
    );

    return this.locationResults;
  }

  getLocationsHTML(city) {
    return `
      <div class="location__result" data-city="${city}">
        <span class="location__pin">
          <svg class="location__pin--icon">
            <use xlink:href="assets/sprites.svg#icon-location"></use>
          </svg>
        </span>
        <h2>${city}, Finland</h2>
      </div>
    `;
  }

  getTitlesHTML(title) {
    return `
      <div class="title">
        <h2>${title}</h2>
      </div>
    `;
  }

  renderTotalCounts(adultCount, childCount, babiesCount) {
    let total = adultCount + childCount + babiesCount;
    if (total > 1) {
      return `${total} guests`;
    } else if (total == 1) {
      return `${total} guest`;
    } else {
      return `Add guests`;
    }
  }
}
