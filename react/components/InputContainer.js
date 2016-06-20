import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import FilterNotifications from '../containers/FilterNotifications';

class InputContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
  }

  handleChange(showInput, event) {
    const element = findDOMNode(this).childNodes[0].childNodes[0];
    if (!showInput)
    element.value = '';
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
    this.setState({ inputValue: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      let text = this.state.inputValue;
      if (text !== '')
      this.props.sendToMessenger(text)
      const element = findDOMNode(this).childNodes[0].childNodes[0];
      element.value = '';
    }
  }

  render() {
    return(
      <div className='input-container'>
        <div className='input-area'>
          <textarea type="text"
            placeholder={ this.props.isEngaged ? "Type your message ..." : "Engage the chat to type"}
            className={this.props.isEngaged ? 'textarea' : 'textarea disabled'}
            onChange={this.handleChange.bind(this, this.props.isEngaged)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
        </div>
        <FilterNotifications />
      </div>
    )
  }
};

export default InputContainer;
