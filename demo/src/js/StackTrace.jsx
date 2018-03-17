// @flow
import React from 'react';

type Props = {
  action: {
    trace: [{
      columnNumber: number,
      fileName: string,
      functionName: string,
      lineNumber: lineNumber,
    }]
  },
};

const StackTrace = ({ action }: Props) => {
  const { trace } = action;
  if (!trace) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '20rem'
      }}>
        <div>No trace data found. A `trace` object is required for the action.</div>
      </div>
    );
  }

  return (
    <div>
      <ul>
        { trace.map((item, i) => (<li key={ i }>
          <a href={ item.fileName }>{ item.fileName }</a>:{ item.lineNumber }:{ item.columnNumber }
        </li>)) }
      </ul>
    </div>
  );
};

export default StackTrace;
