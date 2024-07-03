import React from "react";
import { Customer } from "../types";

interface IProps {
  customer: Customer;
}

export const CustomerInLineComponent: React.FC<IProps> = ({ customer }) => {
  return <div key={customer.id}>customer: {customer.name}</div>;
};
