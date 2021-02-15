import { Card } from '#components';
import React, { FC } from 'react';
import { navigate } from '@reach/router';
import { ErrorOutline } from '@material-ui/icons';

const InvalidToken: FC<{
  heading: string;
  subHeading: string;
}> = (props) => {
  return (
    <Card {...props}>
      <ErrorOutline
        style={{
          color: '#ff6b6b',
          fontSize: '144px',
          alignSelf: 'center',
          margin: '24px 0px 20px 0px',
        }}
      />
      <div className="row center-align">
        <a className="link" onClick={() => navigate('/auth/login')}>
          Login
        </a>
      </div>
    </Card>
  );
};

export default InvalidToken;
