import { NativeStackNavigatorProps } from '@react-navigation/native-stack';
import WorkerMaster from '../model/workerMaster';
import ShiftMaster from '../model/shiftMaster';
import SectionMaster from '../model/sectionMaster';
import BatchMaster from '../model/batchMaster';
import { Weighment } from '../hooks/screenHooks/useRecordPluckingInDetails';
import KamjariMaster from '../model/kamjariMaster';

type RootStackParamList = {
    'Worker Profile': { item: WorkerMaster };
    FaceDetection: {
        setImage: (image: string) => void;
        blinkingEnabled: boolean;
        smileDetectionEnabled: boolean;
        routeName: string | undefined;
    };
    Bluetooth: { shift: ShiftMaster; section: SectionMaster; batch: BatchMaster; weighment: Weighment; kamjari: KamjariMaster };
};

type DrawerParamList = {
    Home: undefined;
};

type NavProp = NativeStackNavigatorProps<RootStackParamLis | DrawerParamList>;
