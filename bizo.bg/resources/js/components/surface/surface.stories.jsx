/**
 * Internal dependencies
 */
import Surface from '@/components/surface/surface';

export default {
    title: 'Pastel/Surface',
    component: Surface,
};

export const Default = {
    render: () => {
        return (
            <Surface>
                <div style={{ padding: 'var(--bz-space-500)' }}>Some Content Here...</div>
            </Surface>
        );
    },
};
