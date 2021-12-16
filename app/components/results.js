import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

// Model / Controller layer for the Results component
// Provides data and logic for the corresponding View layer (template)
export default class ResultsComponent extends Component {
  @service store;

  constructor(...args) {
    super(...args);
  }

  save = (business) => {
    this.store.saveBusiness(business);
    console.log('Saved', business);
  };

  favorite = (business) => {
    this.store.favoriteBusiness(business);
    console.log('Favorited', business);
  };
}
