'use strict';

const React = require('react');
const inputSize = require('./utils').inputSize;

/**
 * The editing class constant.
 */
const EDITING = 'editing';

/**
 * The duplicate key value.
 */
const DUPLICATE = 'duplicate';

/**
 * The document key class.
 */
const KEY_CLASS = 'editable-key';

/**
 * Escape key code.
 */
const ESC = 27;

/**
 * Colon key code.
 */
const COLON = 186;

/**
 * General editable key component.
 */
class EditableKey extends React.Component {

  /**
   * The component constructor.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);
    this.element = props.element;
    this.state = { duplcate: false, editing: false };
  }

  /**
   * Focus on this field on mount, so the tab can do it's job and move
   * to the value field.
   */
  componentDidMount() {
    if (this.isAutoFocusable()) {
      this._node.focus();
    }
  }

  /**
   * Render a single editable key.
   *
   * @returns {React.Component} The element component.
   */
  render() {
    return (
      <input
        type='text'
        className={this.style()}
        ref={(c) => this._node = c}
        size={inputSize(this.renderValue())}
        tabIndex={this.isEditable() ? 0 : -1}
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onKeyUp={this.handleKeyUp.bind(this)}
        value={this.renderValue()}
        title={this.renderTitle()} />
    );
  }

  /**
   * Render the value of the key.
   */
  renderValue() {
    return this.element.parent.currentType === 'Array' ? this.props.index : this.element.currentKey;
  }

  /**
   * Render the title.
   *
   * @returns {String} The title.
   */
  renderTitle() {
    if (this.state.duplicate) {
      return `Duplicate key: '${this.element.currentKey}'`
    }
    return this.element.currentKey;
  }
  /**
   * When hitting a key on the last element some special things may happen.
   *
   * @param {Event} evt - The event.
   */
  handleKeyDown(evt) {
    var value = evt.target.value;
    if (evt.keyCode === ESC) {
      if (value.length === 0) {
        this.element.remove();
      } else {
        this._node.blur();
      }
    }
  }

  /**
   * If they key is a colon, tab to the next input.
   */
  handleKeyUp(evt) {
    if (evt.keyCode === COLON) {
      var value = evt.target.value;
      if (value !== ':') {
        this.element.rename(value.replace(':', ''));
        evt.target.value = '';
        this._node.nextSibling.nextSibling.focus();
      }
    }
  }

  /**
   * Handles changes to the element key.
   *
   * @param {Event} evt - The event.
   */
  handleChange(evt) {
    var value = evt.target.value;
    this._node.size = inputSize(value);
    if (this.isEditable()) {
      if (this.element.isDuplicateKey(value)) {
        this.setState({ duplicate: true });
      } else if (this.state.duplicate) {
        this.setState({ duplicate: false });
      }
      this.element.rename(value);
    }
  }

  /**
   * Handle focus on the key.
   */
  handleFocus() {
    if (this.isEditable()) {
      this.setState({ editing: true });
    }
  }

  /**
   * Handle blur from the key.
   */
  handleBlur() {
    if (this.isEditable()) {
      this.setState({ editing: false });
    }
  }

  /**
   * Is this component auto focusable?
   *
   * This is true if:
   *   - When a new element has been added and is a normal element.
   *   - When not being tabbed into.
   *
   * Is false if:
   *   - When a new array value has been added.
   *   - When the key is _id
   *
   * @returns {Boolean} If the component is editable.
   */
  isAutoFocusable() {
    return this.element.isAdded() && this.isEditable();
  }

  /**
   * Is the key able to be edited?
   *
   * @returns {Boolean} If the key can be edited.
   */
  isEditable() {
    return this.element.isKeyEditable() && this.element.parent.currentType !== 'Array';
  }

  /**
   * Get the style for the key of the element.
   *
   * @returns {String} The key style.
   */
  style() {
    var style = KEY_CLASS;
    if (this.state.editing) {
      style = style.concat(` ${EDITING}`);
    }
    if (this.state.duplicate) {
      style = style.concat(` ${DUPLICATE}`);
    }
    return style;
  }
}

EditableKey.displayName = 'EditableKey';

module.exports = EditableKey;
