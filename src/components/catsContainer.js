import { connect } from 'react-redux';
import CatGrid from './catGrid';

let mapStateToProps = (state) => {
  return state;
};

var CatsContainer = connect(
  mapStateToProps
)(CatGrid);

export default CatsContainer;
