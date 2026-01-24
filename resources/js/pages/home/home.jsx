import Layout from '@/layouts/layout/layout';
import Button from '@/components/button/button';
import Text from '@/components/text/text';
import Box from '@/components/box/box';

const Home = () => {
    return (
        <Box className="home">
            <Text as="h1" variant="heading-l" fontWeight="bold" color="text-primary">Home</Text>
            <Button onClick={() => {}}>Click me</Button>
        </Box>
    );
};

export default Layout.wrap(Home);