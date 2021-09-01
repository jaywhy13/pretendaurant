import React from 'react';


interface IProps {
    customerId: string
}

export const CustomerInLine: React.FC<IProps> = ({ customerId }) => {
    return <div key={customerId}>
        {customerId}
    </div>
}