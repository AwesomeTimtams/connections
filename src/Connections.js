import { useState } from 'react';
import Leaderboard from './Leaderboard';
import './Connections.css'

export default () => {

  const categories = [
    {
        id: '1',
        difficulty: 'easy',
        words: [''],
    },
    {
        id: '2',
        difficulty: 'medium',
        words: [''],
    },
    {
        id: '3',
        difficulty: 'difficult',
        words: [''],
    },
    {
        id: '4',
        difficulty: 'supreme',
        words: [''],
    },
  ]

  return (
    console.log(window.innerWidth, window.innerHeight),
    <div className='screen'>
      <p className='title'>CAREER CONNECTION</p>
      <div className='game'>
        <div className='sideboxes'>
          <Leaderboard></Leaderboard>
        </div>
        <div className='connections'>
          <p>WOAHH</p>
        </div>
        <div className='sideboxes'>
          <Leaderboard></Leaderboard>
        </div>
      </div>
    </div>
  );
}
