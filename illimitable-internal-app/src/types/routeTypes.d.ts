import {NativeStackNavigatorProps} from '@react-navigation/native-stack';

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    ApplyForLeave: undefined;
    TokenTestScreen: undefined;
};

type TabParamList = {
    Dashboard: undefined;
    'My Attendance': undefined;
    Late: undefined;
    Leave: undefined;
    Announcement: undefined;
};

type NavProp = NativeStackNavigatorProps<RootStackParamLis | DrawerParamList>;
