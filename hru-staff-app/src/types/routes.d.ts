import {StackNavigationProp} from '@react-navigation/stack';

// Stack navigator route types
export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    'Order Details': {item: AppointmentData};
    Search: {appointment: AppointmentData[]};
    LabDetails: {test: LabTest};
};

// Stack navigation prop type
export type StackNavProp = StackNavigationProp<RootStackParamList>;
