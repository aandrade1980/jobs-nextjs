import { useAuth } from '@/lib/auth';
import { Avatar, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Header() {
  const auth = useAuth();
  return (
    <Flex backgroundColor="white" w="full" borderTop="5px solid #0AF5F4" mb={8}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        pt={4}
        pb={4}
        maxW="1250px"
        margin="0 auto"
        w="full"
        px={8}
        h="60px"
      >
        <Flex align="center">
          <NextLink href="/" passHref>
            <Link>Home</Link>
          </NextLink>
          <NextLink href="/jobs" passHref>
            <Link mr={4} ml={4}>
              Jobs
            </Link>
          </NextLink>
          <NextLink href="/categories" passHref>
            <Link>Categories</Link>
          </NextLink>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Link
            mr={5}
            fontSize="sm"
            color="gray.600"
            onClick={() => auth.signout()}
          >
            Log Out
          </Link>
          <Avatar size="sm" src={auth.user?.photoUrl} />
        </Flex>
      </Flex>
    </Flex>
  );
}
