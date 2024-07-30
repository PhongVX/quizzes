import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import './styles.scss';
import { useSocket } from '../../context/socket/hooks';
import { SocketEvents } from '../../const';

export const LeaderBoard = () => {
  const [ listLeader, setListLeader ] = useState([]);
  const { socket } = useSocket();

  React.useEffect(() => {
    socket?.on(SocketEvents.LeaderBoardUpdated, (msg) => {
       setListLeader(msg);
    });
  }, []);

  const renderLeaders = () => {
    return listLeader.map((leader: any) => {
        return (
            <li>
                <UserOutlined /> {leader.username}: {leader.score}
            </li>
        )
    })
  }
  console.log(listLeader)
  return (
    <div>
        <h2>Leader board</h2> <br/> 
        <div className='leader-board-list'>
            <ul>
                {
                    renderLeaders()
                }
            </ul>
        </div>
    </div>
  )
}
