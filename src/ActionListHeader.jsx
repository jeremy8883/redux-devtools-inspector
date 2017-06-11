// @flow
import React, { PureComponent } from 'react';
import RightSlider from './RightSlider';

import type { StylingFunction } from 'react-base16-styling';
import KeyBinder from './KeyBinder';

type Props = {
  styling: StylingFunction,
  onSearch: (searchStr: string) => void,
  onCommit: () => void,
  onSweep: () => void,
  hasSkippedActions: boolean,
  hasStagedActions: boolean
};

const getActiveButtons = (hasSkippedActions): Array<'Sweep' | 'Commit'> => [
  hasSkippedActions ? 'Sweep' : null,
  'Commit'
].filter(Boolean);

class ActionListHeader extends PureComponent {
  focusInput = () => {
    this._filterInput.focus();
  }

  render() {
    const { styling, onSearch, hasSkippedActions, hasStagedActions, onCommit,
      onSweep }:Props = this.props;
    return (
      <div {...styling('actionListHeader')}>
        <KeyBinder mappings={[{
          key: 'alt-l',
          onDown: this.focusInput,
        }]} />
        <input
            {...styling('actionListHeaderSearch')}
            onChange={e => onSearch(e.target.value)}
            placeholder='filter...'
            ref={ (i) => this._filterInput = i }
        />
        <div {...styling('actionListHeaderWrapper')}>
          <RightSlider shown={hasStagedActions} styling={styling}>
            <div {...styling('actionListHeaderSelector')}>
              {getActiveButtons(hasSkippedActions).map(btn =>
                  <div
                      key={btn}
                      onClick={() => ({
                        Commit: onCommit,
                        Sweep: onSweep
                      })[btn]()}
                      {...styling([
                        'selectorButton',
                        'selectorButtonSmall'], false, true)}
                  >
                    {btn}
                  </div>
              )}
            </div>
          </RightSlider>
        </div>
      </div>
    );
  }
};

export default ActionListHeader;
