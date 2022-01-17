import Link from 'next/link';
import { Avatar, Flex, Grid, Link as ChakraLink } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Hooks
import { useAuth } from '@/hooks/hooks';

// Utils
import NowPlaying from './NowPlaying';

// Components
import NavItem from './NavItem';

export default function Header({ active }) {
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut({ callbackUrl: '/' });
  }

  return (
    <header>
      <style jsx>{`
        header {
          display: flex;
          width: 100%;
          margin-bottom: 2rem;
          background-color: rgba(255, 255, 255, 0.5);
          -webkit-position: sticky;
          position: sticky;
          top: 0;
          z-index: 3;
          backdrop-filter: blur(10px);
          box-shadow: 0 5px 10px -10px #000;
        }
      `}</style>
      <Flex
        as="nav"
        alignItems="center"
        justifyContent="space-between"
        px={8}
        maxW="1250px"
        margin="0 auto"
        w="full"
        h="60px"
      >
        <Grid
          h="100%"
          templateColumns="1fr 1fr 1fr"
          justifyItems="center"
          alignItems="center"
          gap={4}
        >
          <Link href="/jobs" passHref>
            <NavItem src="/images/home.svg" text="home" active={active} />
          </Link>
          <Link href="/jobs" passHref>
            <NavItem src="/images/jobs.svg" text="jobs" active={active} />
          </Link>
          <Link href="/categories" passHref>
            <NavItem
              src="/images/categories.svg"
              text="categories"
              active={active}
            />
          </Link>
        </Grid>
        <Flex justifyContent="center" alignItems="center">
          <motion.div layoutId="now-playing" drag>
            <NowPlaying />
          </motion.div>
          <ChakraLink
            mx={5}
            fontSize="sm"
            color="gray.600"
            onClick={handleSignOut}
          >
            Log Out
          </ChakraLink>
          <Avatar size="sm" src={user?.image} />
        </Flex>
      </Flex>
    </header>
  );
}
