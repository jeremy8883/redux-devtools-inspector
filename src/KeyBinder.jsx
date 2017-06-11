// @flow
import { PureComponent } from 'react';
import parseKey from 'parse-key';
import { equalsIgnoreCase } from './utils/string';

type Props = {
  mappings: [{
    key: string,
    onDown: (e) => void,
  }],
};

const charCodeToString = (charCode) => {
  switch(charCode) {
  case 37: return 'left';
  case 38: return 'up';
  case 39: return 'right';
  case 40: return 'down';
  default: String.fromCharCode(charCode);
  }
};

export default class KeyBinder extends PureComponent<void, Props, void> {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  matchesKey(key, event) {
    if (!key) return false;

    const charCode = event.keyCode || event.which;
    const char = charCodeToString(charCode);
    return equalsIgnoreCase(key.name, char) &&
        key.alt === event.altKey && key.ctrl === event.ctrlKey &&
        key.meta === event.metaKey && key.shift === event.shiftKey;
  }

  handleKeyDown(e) {
    if (!this.props.mappings) return;

    // Ignore regular keys when focused on a field
    // and no modifiers are active.
    if (!e.ctrlKey && !e.metaKey && !e.altKey &&
        (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable)
    ) {
      return;
    }

    const { mappings } = this.props;
    for (let mapping of mappings) {
      if (this.matchesKey(parseKey(mapping.key), e)) {
        e.preventDefault();
        mapping.onDown(e);
      }
    }
  }

  render() {
    return null;
  }
}
