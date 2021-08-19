import { RootState } from "../../store";


export const selectCustomersWaitingToJoinLine = (state: RootState) => state.restaurant.customersWaitingToJoinLine;

export const selectLines = (state: RootState) => state.restaurant.lines;

export const selectEmptiestLine = (state: RootState) => {
    if (state.restaurant.lines) {
        let emptiestLine = state.restaurant.lines[0];
        state.restaurant.lines.forEach(line => {
            if (line.customers.length < emptiestLine.customers.length) {
                emptiestLine = line;
            }
        })
        return emptiestLine;
    }

    return undefined;
}