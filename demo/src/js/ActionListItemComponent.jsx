import React from 'react';

const getIcon = action => {
  switch(action.sequence) {
  case 'REQUEST_START': return '🙂';
  case 'REQUEST_ERROR': return '😡';
  case 'REQUEST_SUCCESS': return '😎';
  case 'REQUEST_CANCEL': return '😵';
  default: return undefined;
  }
};

const underscoreToCamelcase = str =>
  str.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase());

const ActionListItemComponent = ({ descriptiveActionType, action }) => {
  const icon = getIcon(action);
  return <div>
    { icon && icon + ' ' }
    { underscoreToCamelcase(descriptiveActionType) }
  </div>;
};

export default ActionListItemComponent;
