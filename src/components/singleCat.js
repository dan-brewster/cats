import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

var SingleCat = React.createClass({

  propTypes: {
    catInfo: PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div className="singleCat">
        <span className="catFact">{this.props.catInfo.fact}</span>
        <img className="catPic" width="200" src={this.props.catInfo.pic} />
      </div>
    )
  }
});

export default SingleCat;
