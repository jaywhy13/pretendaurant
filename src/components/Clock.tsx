import React from 'react';
import { useSelector } from 'react-redux'
import { selectTime } from '../features/clock/clockSlice';


interface IProps {
}


const formatTimeComponent = (component: number): string => {
    return component.toString().padStart(2, '0');
}

export const Clock: React.FC<IProps> = () => {
    const { hour, minutes } = useSelector(selectTime);
    return <div>Time: {formatTimeComponent(hour)}:{formatTimeComponent(minutes)}</div>
}