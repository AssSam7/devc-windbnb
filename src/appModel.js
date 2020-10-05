export default class AppModal {
  constructor(data) {
    this.data = data;
    this.cities = [];
  }

  // Methods
  getCities() {
    let cities = new Set();
    this.data.forEach((hotel) => {
      cities.add(hotel.city);
    });
    this.cities = [...cities];
  }

  getStays(city, noOfGuests) {
    let stays = [];
    if (city !== null && noOfGuests === null) {
      stays = this.data.filter((stay) => stay.city === city);
      return stays;
    } else if (noOfGuests !== null && city === null) {
      stays = this.data.filter((stay) => stay.maxGuests >= noOfGuests);
      return stays;
    } else if (city && noOfGuests) {
      stays = this.data.filter(
        (stay) => stay.city === city && stay.maxGuests >= noOfGuests
      );
      return stays;
    }
    return this.data;
  }
}
