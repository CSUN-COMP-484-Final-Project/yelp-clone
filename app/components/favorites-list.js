import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

// Model / Controller layer for the FavoritesList component
// Provides data and logic for the corresponding View layer (template)
export default class FavoritesListComponent extends Component {
  @service store;

  constructor(...args) {
    super(...args);
  }

  save = (business) => {
    this.store.saveBusiness(business);
    console.log('Saved', business);
  };

  remove = (index) => {
    const temp = [...this.store.favorites];
    const [removed] = temp.splice(index, 1);
    this.store.setFavorites(temp);
    console.log('Removed', removed);
    alert('Removed business!');
  };
}
