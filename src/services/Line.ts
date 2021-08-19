import { Customer, Line } from "../types";

const LINES: Line[] = [];

class LineService {
    public list(): Line[] {
        return LINES;
    }

    public get(id: string): Line | undefined {
        return LINES.find(candidateLine => candidateLine.id === id);
    }

    public create(customers: Customer[] = []): Line {
        const id = LINES.length.toString();
        const line = {
            id,
            customers
        };
        LINES.push(line);
        return { ...line };
    }

    public addCustomerToLine(lineId: string, customer: Customer) {
        const line = this.get(lineId);
        if (line) {
            const updatedLine = {
                ...line,
                customers: line?.customers.concat([customer])
            }
            console.log("Adding", customer, "to", line.customers);
            const index = LINES.findIndex(candidateLine => candidateLine.id === lineId);
            LINES[index] = updatedLine;
        }
    }

    public getEmptiestLine() {
        let emptiestLine = LINES[0];
        LINES.forEach((line) => {
            if (line.customers.length < emptiestLine.customers.length) {
                emptiestLine = line;
            }
        })
        return emptiestLine;
    }
}

export const lineService = new LineService();