import Image from 'next/image';
import React from 'react';
import { Text } from '@chakra-ui/react';

const NavItem = React.forwardRef(
  ({ active, href, onClick, src, text }, ref) => (
    <a
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        borderBottom: active === text ? 'solid 2px black' : '',
        width: '100%',
        alignItems: 'center'
      }}
      href={href}
      onClick={onClick}
      ref={ref}
    >
      <Image src={src} alt={text} height={28} width={28} />
      <Text fontSize="xs">{text}</Text>
    </a>
  )
);

NavItem.displayName = 'NavItem';

export default NavItem;
