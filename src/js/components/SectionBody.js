import classnames from 'classnames';
import React from 'react';

class SectionBody extends React.Component {
  render() {
    let classes = classnames(this.props.className, this.props.layoutClassName);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

SectionBody.defaultProps = {
  className: 'section-body',
  layoutClassName: ''
};

SectionBody.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string
};

module.exports = SectionBody;
