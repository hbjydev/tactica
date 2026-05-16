import { Unit } from "@/types/units";
import AppLayout from "@/layouts/app-layout";

type Props = {
    unit: Unit;
    auth: {
        units: Unit[];
    };
};

const Dashboard = ({ unit }: Props) => {
    return (
        <p>Hello, {unit.display_name}!</p>
    );
};

Dashboard.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [],
    },
];

export default Dashboard;
