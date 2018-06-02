import React from "react";
import PropTypes from "prop-types";
import "./progress.less";

const propTypes = {
  progress: PropTypes.number.isRequired
};
class Progress extends React.Component {
  static defaultProps = {
    bgColor: "#2f9842"
  };
  constructor() {
    super();
    this.progressChange = this.progressChange.bind(this);
  }

  progressChange(e) {
    let progressBar = this.refs.progressBar;
    let progress =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.clientWidth;
    this.props.onProgressChange(progress);
  }
  render() {
    return (
      <div>
        <div
          className="components-progress"
          onClick={this.progressChange}
          ref="progressBar"
        >
          <div
            className="progress"
            style={{
              width: `${this.props.progress}%`,
              background: this.props.bgColor
            }}
          />
        </div>
      </div>
    );
  }
}

Progress.propTypes = propTypes;

export default Progress;
