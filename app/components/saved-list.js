import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

// Model / Controller layer for the SavedList component
// Provides data and logic for the corresponding View layer (template)
export default class SavedListComponent extends Component {
  @service store;

  constructor(...args) {
    super(...args);
  }

  favorite = (business) => {
    this.store.favoriteBusiness(business);
    console.log('Favorited', business);
  };

  remove = (index) => {
    const temp = [...this.store.saved];
    const [removed] = temp.splice(index, 1);
    this.store.setSaved(temp);
    console.log('Removed', removed);
    alert('Removed business!');
  };
}
