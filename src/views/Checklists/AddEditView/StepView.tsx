import React, { FC } from 'react';
import { Step, Interaction } from '../types';

const Step: FC<{ step: Step }> = ({ step }) =>
  console.log('step :: ', step) || (
    <div
      style={{
        borderRadius: '5px',
        boxShadow:
          '0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
        marginBottom: '24px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          padding: '16px 8px',
          backgroundColor: '#f4f4f4',
          borderBottom: '2px solid #00aab4',
        }}
      >
        {step.name}
      </div>
      <div style={{ display: 'flex', backgroundColor: '#f4f4f4' }}>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            borderRight: '1px solid #dadada',
            padding: '16px',
            color: '#00aab4',
          }}
        >
          Add Stop
        </div>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            borderRight: '1px solid #dadada',
            padding: '16px',
            color: '#00aab4',
          }}
        >
          Due On
        </div>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            borderRight: '1px solid #dadada',
            padding: '16px',
            color: '#00aab4',
          }}
        >
          Timed
        </div>
        <div
          style={{
            flex: 1,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            padding: '16px',
            color: '#00aab4',
          }}
        >
          Optional
        </div>
      </div>
      <div
        style={{
          marginTop: '16px',
          borderRadius: '4px',
          boxShadow:
            '0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
        }}
      >
        <ol>
          {step.interactions[0].data?.map((el, index) => (
            <li key={index}>
              <div>{el.text}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

export default Step;
