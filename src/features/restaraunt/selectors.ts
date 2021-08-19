import { RootState } from "../../store";


export const selectCustomersWaitingToJoinLine = (state: RootState) => state.restaraunt.customersWaitingToJoinLine;

export const selectLines = (state: RootState) => state.restaraunt.lines;

export const selectEmptiestLine = (state: RootState) => {
    if (state.restaraunt.lines) {
        let emptiestLine = state.restaraunt.lines[0];
        state.restaraunt.lines.forEach(line => {
            if (line.customers.length < emptiestLine.customers.length) {
                emptiestLine = line;
            }
        })
        return emptiestLine;
    }

    return undefined;
}