import { useState } from 'react';
import podium from './assets/podium.png';
import pfp from './assets/pfp.png';

export default () => {

    const people = [
        {
            name: 'Matthew Ng',
            school: 'Trinity Grammar College',
            time: '80'
        }, {
            name: 'Chae Jeong',
            school: 'Scots College',
            time: '260'
        }, {
            name: 'Sylvan Tam',
            school: 'North Sydney Girls High School',
            time: '200'
        }
    ]

    people.sort((a, b) => Number(a.time) - Number(b.time));

    return (
    <div>
        <div className='lb_title_div'>
            <img src={podium} alt="podium" className='podium'/>
            <p className='lb_title'>Leaderboard</p>
        </div>
        <ol>
            {people.map((p, i) => (
                <li key={i}>
                    <div className='people'>
                        <img src={pfp} className='pfp'/>
                        <p className='name'>{p.name}</p>
                        <p className='school'>{p.school}</p>
                        <p className='time'>{p.time}</p>
                    </div>
                </li>
            ))}
        </ol>
    </div>
    );
}
