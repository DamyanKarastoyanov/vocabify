import Box from '@/components/box/box';
import Button from '@/components/button/button';
import InlineStack from '@/components/inline-stack/inline-stack';

const NavigationControls = (props) => {
    const { currentIndex, totalWords, onPrevious, onNext } = props;

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalWords - 1;

    return (
        <InlineStack align="space-between" blockAlign="center">
            <Button variant="secondary" onClick={onPrevious} disabled={isFirst}>
                Previous
            </Button>
            <Button variant="primary" onClick={onNext} disabled={isLast}>
                {isLast ? 'Finish' : 'Next'}
            </Button>
        </InlineStack>
    );
};

export default NavigationControls;
