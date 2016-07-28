import { connect } from 'react-redux';
import CatGrid from './catGrid';

let mapStateToProps = (state) => {
  return {
    cats: state.cats
  }
};

var CatsContainer = connect(
  mapStateToProps
)(CatGrid);

export default CatsContainer;
