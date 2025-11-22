import { Feather } from '@expo/vector-icons';
import React from 'react';

type FeatherIconProps = React.ComponentProps<typeof Feather>;

const FeatherIcon: React.FC<FeatherIconProps> = (props) => {
  return <Feather {...props} />;
};

export default FeatherIcon;