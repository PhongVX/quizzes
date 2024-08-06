import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';

import { useSocket } from '../../context/socket/hooks';
import { SocketEvents } from '../../const';

import './styles.scss';
import { useQuizDataFromUrl } from '../../hooks/useQuizDataFromUrl';

export const LeaderBoard = () => {
  const [ listLeader, setListLeader ] = useState([]);
  const { socket } = useSocket();
  const { getQuizInfoFromUrl } = useQuizDataFromUrl();
  const { username, quizId } = getQuizInfoFromUrl();

  React.useEffect(() => {
    socket?.emit(SocketEvents.GetLatestLeaderBoard, { username, quizId });
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
