import { MotionBox } from '@/util/chakra-motion';

const loaderVariants = {
  animationOne: {
    x: [-20, 20],
    y: [0, -30],
    transition: {
      x: {
        repeat: Infinity,
        duration: 0.5
      },
      y: {
        repeat: Infinity,
        duration: 0.25,
        ease: 'easeOut'
      }
    }
  }
};

const Spinner = () => (
  <MotionBox
    width="12px"
    height="12px"
    margin="50px auto"
    borderRadius="50%"
    backgroundColor="blue.500"
    variants={loaderVariants}
    animate="animationOne"
  />
);

export default Spinner;
