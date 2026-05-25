import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { orbat } from '@/wayfinder/routes/unit/structure';
import { Inertia } from '@/wayfinder/types';
import { ORBAT } from '@/components/orbat';

type Props = Inertia.Pages.Units.Structure.Orbat;

const OrbatPage = ({ sections }: Props) => {
    return (
        <>
            <div className="flex flex-col p-4">
                <Heading
                    title="ORBAT"
                    description="The ORBAT (Order of Battle) provides a hierarchical view of your unit's structure, allowing you to visualize the relationships between sections and their sub-sections."
                />
            </div>
            <ORBAT sections={sections} />
        </>
    );
};

OrbatPage.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'ORBAT',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: orbat({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default OrbatPage;
