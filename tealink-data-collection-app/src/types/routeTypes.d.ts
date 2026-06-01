import { NativeStackNavigatorProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Form: { screen: Screen };
    GeoFencing: { sectionData: { _id: string; name: string }[] };
};

type DrawerParamList = {
    Home: undefined;
};

type NavProp = NativeStackNavigatorProps<RootStackParamLis | DrawerParamList>;
