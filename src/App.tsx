import React, { FC } from 'react';

interface IAppProps {
  userName?: string;
  language?: string;
}

const App: FC<IAppProps> = ({ userName, language }) => {
  return (
    <div>
      Hi {userName} you are using {language}
    </div>
  );
};

App.defaultProps = {
  userName: 'Test',
  language: 'Typescript',
};

export default App;
