import { Heading } from '@chakra-ui/react';

const ErrorMessage = ({ message }) => (
  <Heading
    as="span"
    size="xs"
    role="alert"
    color="red.500"
    fontWeight="700"
    ml={1}
  >
    {message}
  </Heading>
);

export default ErrorMessage;
