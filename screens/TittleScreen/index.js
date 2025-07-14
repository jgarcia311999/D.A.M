import { Platform } from 'react-native';
import TittleWeb from './TittleWeb';
import TittleMobile from './TittleMobile';

export default function TittleScreen(props) {
  return Platform.OS === 'web'
    ? <TittleWeb {...props} />
    : <TittleMobile {...props} />;
}