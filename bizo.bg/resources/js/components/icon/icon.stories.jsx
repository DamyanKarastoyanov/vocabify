/**
 * Internal dependencies
 */
import Icon from '@/components/icon/icon';
import IconHelp from '@/components/icons/help';
import upperFirst from '@/utils/upper-first';

export default {
    title: 'Pastel/Icon',
    component: Icon,
};

export const Default = {
    render: () => <Icon icon={IconHelp} />,
};

export const Library = {
    render: () => {
        const icons = import.meta.glob('@/components/icons/*.jsx', { eager: true });

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                    gap: '8px',
                }}
            >
                {Object.entries(icons).map(([path, module]) => {
                    const name = path
                        .replace('/resources/components/icons/', '')
                        .replace('.jsx', '')
                        .split('-')
                        .map(upperFirst)
                        .join('');

                    return (
                        <div
                            key={path}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                alignItems: 'center',
                                padding: '16px',
                                border: '1px solid #eee',
                            }}
                        >
                            <Icon icon={module.default} />

                            <span style={{ fontSize: '14px' }}>Icon{name}</span>
                        </div>
                    );
                })}
            </div>
        );
    },
};
