import React from 'react';
import { Result } from 'antd';

export function Error({ message }) {
  return (
    <Result
      status="error"
      title="Oops, it looks like there was an error!"
      subTitle={message}
    />
  );
}