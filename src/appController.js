// Data JSON
import { data } from "./data";
// Views
import AppView from "./Views/appView";
// Model
import AppModel from "./appModel";

class AppController {
  constructor() {
    this.model = new AppModel(data);
    this.stays = this.model.data;
    // Call the getCities() to generate the cities from the data
    this.model.getCities();
    this.appView = new AppView(this.model);

    // Search functionality
    this.searchStays();
  }

  // Methods
  searchStays() {
    this.appView.searchBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        [
          this.searchLocation,
          this.searchNoOfGuests,
        ] = this.appView.initSearch();
        console.log(this.searchLocation, this.searchNoOfGuests);

        // Get the stays according to the search
        this.stays = this.model.getStays(
          this.searchLocation,
          this.searchNoOfGuests
        );
        // Pass the new stays to the view
        this.appView.processSearch(this.stays);
      });
    });
  }
}

// Call the App Contoller
document.addEventListener("DOMContentLoaded", function (event) {
  new AppController();
});
