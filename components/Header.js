import { Avatar, Flex, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';

import { useAuth } from '@/lib/auth';
import NowPlaying from './NowPlaying';

export default function Header({ active }) {
  const auth = useAuth();

  return (
    <div>
      <style jsx>{`
        div {
          display: flex;
          width: 100%;
          margin-bottom: 2rem;
          background-color: rgba(255, 255, 255, 0.5);
          -webkit-position: sticky;
          position: sticky;
          top: 0;
          z-index: 1;
          backdrop-filter: blur(10px);
          box-shadow: 0 5px 10px -10px #000;
        }
      `}</style>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={8}
        maxW="1250px"
        margin="0 auto"
        w="full"
        h="60px"
      >
        <Flex align="center" h="100%">
          <NextLink href="/" passHref>
            <Link
              display="flex"
              alignContent="center"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              px={4}
              py={1}
            >
              <Image src="/images/home.svg" alt="Home" height={28} width={28} />
              <Text fontSize="xs">home</Text>
            </Link>
          </NextLink>
          <NextLink href="/jobs" passHref>
            <Link
              mr={4}
              ml={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
              px={4}
              py={2}
              borderBottom={active === 'jobs' ? '2px solid black' : ''}
            >
              <Image src="/images/jobs.svg" alt="Jobs" height={28} width={28} />
              <Text fontSize="xs">jobs</Text>
            </Link>
          </NextLink>
          <NextLink href="/categories" passHref>
            <Link
              display="flex"
              display="flex"
              flexDirection="column"
              alignItems="center"
              px={2}
              py={2}
              borderBottom={active === 'categories' ? '2px solid black' : ''}
            >
              <Image
                src="/images/categories.svg"
                alt="Categories"
                height={28}
                width={28}
              />
              <Text fontSize="xs">categories</Text>
            </Link>
          </NextLink>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <NowPlaying />
          <Link
            mx={5}
            fontSize="sm"
            color="gray.600"
            onClick={() => auth.signout()}
          >
            Log Out
          </Link>
          <Avatar size="sm" src={auth.user?.photoURL} />
        </Flex>
      </Flex>
    </div>
  );
}
