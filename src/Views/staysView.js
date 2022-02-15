export default class StaysView {
  constructor(model) {
    this.model = model;
    this.stays = this.model.data;

    /* DOM Elements */
    // Loader
    this.loaderContainer = document.querySelector(".loader");
    this.notFoundContainer = document.querySelector(".not__found");

    // Stays
    this.mainStaysContainer = document.querySelector(".stays__container");

    /* Method calls */
    this.init(this.stays);
  }

  // Methods
  init(stays) {
    this.showLoader();
    setTimeout(() => {
      this.hideLoader();
      this.renderStays(stays);
      const skeletons = document.querySelectorAll(".skeleton");
      skeletons.forEach((skeleton) => {
        setTimeout(() => {
          skeleton.classList.remove("skeleton");
        }, 2000);
      });
    }, 3000);
  }

  showLoader() {
    /* Check if they already exist */
    if (this.staysInfo && this.staysContainer) {
      this.mainStaysContainer.innerHTML = "";
      this.notFoundContainer.style.display = "none";
    }
    this.loaderContainer.style.display = "flex";
  }

  hideLoader() {
    this.loaderContainer.style.display = "none";
  }

  renderStays(stays) {
    if (stays.length > 1) {
      // Hide the not found container
      this.notFoundContainer.style.display = "none";

      /* Check if they already exist */
      if (this.staysInfo && this.staysContainer) {
        this.mainStaysContainer.innerHTML = "";
      }

      // Create the staysInfo element
      this.staysInfo = document.createElement("div");
      this.staysInfo.setAttribute("class", "stays__info");
      this.staysInfo.insertAdjacentHTML(
        "beforeend",
        this.getStaysInfoHTML(stays.length)
      );

      // Append the staysInfo to the mainStays container
      this.mainStaysContainer.prepend(this.staysInfo);

      // Create and the stays container
      this.staysContainer = document.createElement("div");
      this.staysContainer.setAttribute("class", "stays");

      // Add the individual stays
      stays.forEach((stay) => {
        // Create the individual stay element
        let individualStay = document.createElement("div");
        individualStay.setAttribute("class", "stay");
        individualStay.insertAdjacentHTML(
          "beforeend",
          this.getStayImage(stay.photo)
        );
        individualStay.insertAdjacentHTML(
          "beforeend",
          this.getStayDetails(stay.superHost, stay.type, stay.beds, stay.rating)
        );
        individualStay.insertAdjacentHTML(
          "beforeend",
          this.getStayTitle(stay.title)
        );

        // Append each stay to container
        this.staysContainer.appendChild(individualStay);
      });

      // Append the stays container
      this.mainStaysContainer.appendChild(this.staysContainer);
      this.mainStaysContainer.style.marginBottom = "5rem";
    } else {
      this.notFoundContainer.style.display = "flex";
    }
  }

  getStayImage(stayImage) {
    return `
      <div class="stay__img skeleton">
        <img src="${stayImage}"/>
      </div>
    `;
  }

  getStayDetails(superHost, type, beds, rating) {
    if (superHost && beds) {
      return `
        <div class="stay__details skeleton">
          <div class="stay__category skeleton">
            <div class="super-host skeleton">Super host</div>
            <h2 class="type skeleton">${type}</h2>
            <p class="separator skeleton">.</p>
            <h2 class="beds skeleton">${
              beds >= 1 ? `${beds} beds` : `1 bed`
            }</h2>
          </div>
          <div class="stay__rating skeleton">
            <svg class="star skeleton">
              <use xlink:href="assets/sprites.svg#icon-star"></use>
            </svg>
            <h3 class="rating skeleton">${rating}</h3>
          </div>
        </div>
      `;
    } else if (superHost && beds === null) {
      return `
          <div class="stay__details skeleton">
            <div class="stay__category skeleton">
              <div class="super-host skeleton">Super host</div>
              <h2 class="type skeleton">${type}</h2>
            </div>
            <div class="stay__rating skeleton">
              <svg class="star skeleton">
                <use xlink:href="assets/sprites.svg#icon-star"></use>
              </svg>
              <h3 class="rating skeleton">${rating}</h3>
            </div>
          </div>
        `;
    } else if (!superHost && beds) {
      return `
          <div class="stay__details skeleton">
            <div class="stay__category skeleton">
              <h2 class="type skeleton">${type}</h2>
              <p class="separator skeleton">.</p>
              <h2 class="beds skeleton">${
                beds > 1 ? `${beds} beds` : `1 bed`
              }</h2>
            </div>
            <div class="stay__rating skeleton">
              <svg class="star skeleton">
                <use xlink:href="assets/sprites.svg#icon-star"></use>
              </svg>
              <h3 class="rating skeleton">${rating}</h3>
            </div>
          </div>
        `;
    } else {
      return `
          <div class="stay__details skeleton">
            <div class="stay__category skeleton">
              <h2 class="type skeleton">${type}</h2>
            </div>
            <div class="stay__rating skeleton">
              <svg class="star skeleton">
                <use xlink:href="assets/sprites.svg#icon-star"></use>
              </svg>
              <h3 class="rating skeleton">${rating}</h3>
            </div>
          </div>
        `;
    }
  }

  getStayTitle(stayTitle) {
    return `
      <div class="stay__title skeleton">
        ${stayTitle}
      </div>
    `;
  }

  getStaysInfoHTML(staysLength) {
    if (staysLength > 1) {
      return `
      <h1>Stays in Finland</h1>
      <h3 id="totalStays">${staysLength} stays</h3>
    `;
    }
    return `
      <h1>Stays in Finland</h1>
      <h3 id="totalStays">${staysLength} stay</h3>
    `;
  }
}
