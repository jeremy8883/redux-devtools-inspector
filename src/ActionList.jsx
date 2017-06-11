// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import ActionListRow from './ActionListRow';
import ActionListHeader from './ActionListHeader';

import type { StylingFunction } from 'react-base16-styling';
import type { Action } from './types';
import KeyBinder from './KeyBinder';
import * as R from 'ramda';

type Props = {
  styling: StylingFunction,
  actions: {
    [id: number]: Action
  },
  actionIds: number[],
  lastActionId: number,
  isWideLayout: boolean,
  onToggleAction: (actionId: number) => void;
  skippedActionIds: number[],
  selectedActionId: number,
  startActionId: null | number,
  onSelect: (e: SyntheticMouseEvent, actionId: number) => void,
  onSearch: (searchStr: string) => void,
  searchValue: string,
  currentActionId: number,
  onCommit: () => void,
  onSweep: () => void,
  onJumpToState: (actionId: number) => void
};

function getTimestamps(actions, actionIds, actionId) {
  const idx = actionIds.indexOf(actionId);
  const prevActionId = actionIds[idx - 1];

  return {
    current: actions[actionId].timestamp,
    previous: idx ? actions[prevActionId].timestamp : 0
  };
}

export default class ActionList extends PureComponent<void, Props, void> {
  componentDidMount() {
    this.scrollToBottom(true);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.lastActionId !== prevProps.lastActionId) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(force?: boolean) {
    const el = ReactDOM.findDOMNode(this.refs.rows);
    const scrollHeight = el.scrollHeight;
    if (force || Math.abs(scrollHeight - (el.scrollTop + el.offsetHeight)) < 50) {
      el.scrollTop = scrollHeight;
    }
  }

  findSelectedActionIndex() {
    const { actionIds, selectedActionId } = this.props;
    return actionIds.findIndex(R.equals(selectedActionId));
  }

  getPreviousActionId() {
    const index = this.findSelectedActionIndex();
    return index === -1 ?
        this.props.lastActionId :
        this.props.actionIds[Math.max(0, index - 1)];
  }

  getNextActionId() {
    const index = this.findSelectedActionIndex();
    return index === -1 ?
        this.props.lastActionId :
        this.props.actionIds[Math.min(this.props.actionIds.length - 1, index + 1)];
  }

  render() {
    const { styling, actions, actionIds, isWideLayout, onToggleAction, skippedActionIds,
            selectedActionId, startActionId, onSelect, onSearch, searchValue, currentActionId,
            onCommit, onSweep, onJumpToState } = this.props;
    const lowerSearchValue = searchValue && searchValue.toLowerCase();
    const filteredActionIds = searchValue ? actionIds.filter(
      id => actions[id].action.type.toLowerCase().indexOf(lowerSearchValue) !== -1
    ) : actionIds;

    return (
      <div
        key='actionList'
        {...styling(
          ['actionList', isWideLayout ? 'actionListWide' : null], isWideLayout
        )}
      >
        <KeyBinder mappings={ [{
          key: 'alt-up',
          onDown: (e) => onSelect(e, this.getPreviousActionId()),
        }, {
          key: 'alt-down',
          onDown: (e) => onSelect(e, this.getNextActionId()),
        }] } />
        <ActionListHeader styling={styling}
                          onSearch={onSearch}
                          onCommit={onCommit}
                          onSweep={onSweep}
                          hasSkippedActions={skippedActionIds.length > 0}
                          hasStagedActions={actionIds.length > 1} />
        <div {...styling('actionListRows')} ref='rows'>
          {filteredActionIds.map(actionId =>
            <ActionListRow key={actionId}
                           styling={styling}
                           isInitAction={!actionId}
                           isSelected={
                            startActionId !== null &&
                            actionId >= startActionId && actionId <= selectedActionId ||
                            actionId === selectedActionId
                           }
                           isInFuture={actionId > currentActionId}
                           onSelect={(e) => onSelect(e, actionId)}
                           timestamps={getTimestamps(actions, actionIds, actionId)}
                           action={actions[actionId].action}
                           onToggleClick={() => onToggleAction(actionId)}
                           onJumpClick={() => onJumpToState(actionId)}
                           onCommitClick={() => onCommit(actionId)}
                           isSkipped={skippedActionIds.indexOf(actionId) !== -1} />
          )}
        </div>
      </div>
    );
  }
}
