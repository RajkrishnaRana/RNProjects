import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';

interface NativeTouchProps {
    children: React.ReactNode;
    style?: object;
    onPress?: () => void;
}

const NativeTouch: React.FC<NativeTouchProps> = ({ children, ...props }) =>
    Platform.OS === 'android' && Platform.Version >= 21 ? (
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ffffff30', false)} {...props}>
            <View style={props.style}>{children}</View>
        </TouchableNativeFeedback>
    ) : (
        <TouchableOpacity activeOpacity={0.75} {...props}>
            {children}
        </TouchableOpacity>
    );

export default NativeTouch;
