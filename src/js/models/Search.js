const axios = require('axios');

// for search
// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

//for recipe
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

export default class Search {
  constructor(query) {
    //
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
