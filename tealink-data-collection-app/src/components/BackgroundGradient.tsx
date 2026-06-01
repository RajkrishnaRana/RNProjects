import LinearGradient from 'react-native-linear-gradient';

export default function BackgroundGradient({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            style={{ flex: 1 }}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
            locations={[0, 0.5, 0.6]}
            colors={['#fafcfb', '#e3fae7', '#def9e5ff']}
        >
            {children}
        </LinearGradient>
    );
}
