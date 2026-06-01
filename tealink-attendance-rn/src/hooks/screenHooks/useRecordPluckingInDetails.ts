import { useEffect, useState } from 'react';
import { database } from '../../..';
import SectionMaster from '../../model/sectionMaster';
import BatchMaster from '../../model/batchMaster';
import ShiftMaster from '../../model/shiftMaster';
import PluckedQuantityMaster from '../../model/pluckedQuantityMaster';
import { Q } from '@nozbe/watermelondb';
import { useNavigation } from '../useNavigation';
import { Alert, Linking, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
// import NfcManager from 'react-native-nfc-manager';
import KamjariMaster from '../../model/kamjariMaster';

export interface Weighment {
    id: number;
    name: string;
}

const WEIGHMENTDATA: Weighment[] = [
    {
        id: 1,
        name: '1st Weighment',
    },
    {
        id: 2,
        name: '2nd Weighment',
    },
    {
        id: 3,
        name: '3rd Weighment',
    },
    {
        id: 4,
        name: '4th Weighment',
    },
];

const useRecordPluckingInDetails = () => {
    const navigation = useNavigation();
    const [section, setSection] = useState();
    const [allSection, setAllSection] = useState<SectionMaster[]>();
    const [batch, setBatch] = useState<BatchMaster>();
    const [allBatch, setAllBatch] = useState<BatchMaster[]>([]);
    const [shift, setShift] = useState();
    const [allShift, setAllShift] = useState<ShiftMaster[]>([]);
    const [weighment, setWeighment] = useState<Weighment>(WEIGHMENTDATA[0]);
    const [kamjari, setKamjari] = useState<KamjariMaster>();
    const [allKamjari, setAllKamjari] = useState<KamjariMaster[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);

    const openSettings = () => {
        Linking.openSettings();
    };

    const checkLocationServices = async (): Promise<boolean> => {
        return new Promise(resolve => {
            Geolocation.getCurrentPosition(
                () => resolve(true),
                error => {
                    if (error.code === 2) {
                        // POSITION_UNAVAILABLE
                        resolve(false);
                    } else {
                        resolve(true); // Other errors don't mean services are off
                    }
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 },
            );
        });
    };

    const handleNext = async () => {
        if (!kamjari) {
            Toast.show({
                type: 'error',
                text1: 'Kamjari Required',
                text2: 'No Kamjari is present for this user',
            });
            return;
        }

        const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        const status = await check(permission);

        // const enabled = await NfcManager.isEnabled();
        // if (!enabled) {
        //     Alert.alert('NFC is disabled', 'Please enable NFC to continue', [
        //         { text: 'Cancel', onPress: () => {} },
        //         {
        //             text: 'Open Settings',
        //             onPress: async () => {
        //                 await Linking.sendIntent('android.settings.NFC_SETTINGS');
        //             },
        //         },
        //     ]);
        // }

        // Recheck it
        // const e = await NfcManager.isEnabled();
        // if (!e) {
        //     return;
        // }

        if (status !== RESULTS.GRANTED) {
            const result = await request(permission);
            if (result !== RESULTS.GRANTED) {
                Alert.alert(
                    'Location Permission Required',
                    'Location permission is required to scan for Bluetooth devices. Please enable it in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: openSettings },
                    ],
                );
            }
        }

        if (status === RESULTS.GRANTED) {
            setLocationLoading(true);
            const locationServicesEnabled = await checkLocationServices();
            if (!locationServicesEnabled) {
                Toast.show({
                    type: 'error',
                    text1: 'Location Services Required',
                    text2: 'Location services are disabled. Please enable them in settings.',
                });
                setLocationLoading(false);
                return;
            }
            navigation.push('Bluetooth', { section, shift, batch, weighment, kamjari });
            setLocationLoading(false);
        }
    };

    const handleLogs = () => navigation.push('BleLogs');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const now = new Date();
                const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

                const sectionMasterCollection = database.collections.get<SectionMaster>('section_master');
                const batchMasterCollection = database.collections.get<BatchMaster>('batch_master');
                const shiftMasterCollection = database.collections.get<ShiftMaster>('shift_master');
                const kamjariMasterCollection = database.collections.get<KamjariMaster>('kamjari_master');
                const pluckedQuantityMasterCollection = database.collections.get<PluckedQuantityMaster>('plucked_quantity_master');

                // Fetch all in parallel
                const [sections, batches, allShifts, kamjaris, pluckedRecords] = await Promise.all([
                    sectionMasterCollection.query().fetch(),
                    batchMasterCollection.query(Q.or(Q.where('batch_type', 'PLUCKING'), Q.where('batch_type', 'PLK'))).fetch(),
                    // shiftMasterCollection.query(Q.or(Q.where('shift_code', 'PLK'), Q.where('shift_code', 'PLUCKING'))).fetch(),
                    shiftMasterCollection.query().fetch(),
                    kamjariMasterCollection.query(Q.where('kamjari_type', 'PLUCKING')).fetch(),
                    pluckedQuantityMasterCollection
                        .query(Q.where('record_date', Q.gte(String(startOfToday))), Q.where('record_date', Q.lt(String(endOfToday))))
                        .fetch(),
                ]);

                const _pluckingKamjaris = [];
                for (let i = 0; i < kamjaris.length; i++) {
                    _pluckingKamjaris.push(kamjaris[i].kamjariId);
                }

                const shifts = [];
                for (let i = 0; i < allShifts.length; i++) {
                    const currentShift = allShifts[i];
                    const currentShiftKamjariId = currentShift.kamjariId;
                    if (_pluckingKamjaris.indexOf(currentShiftKamjariId) > -1) {
                        shifts.push(currentShift);
                    }
                }

                setAllSection(sections);
                setAllBatch(batches);
                setAllShift(shifts);
                setAllKamjari(kamjaris);

                setKamjari(prev => {
                    if (prev) return prev;

                    if (kamjaris?.length > 1) {
                        for (const k of kamjaris) {
                            if (k.kamjariIsDefault) {
                                return k;
                            }
                        }
                    }

                    return kamjaris?.[0];
                });

                // Process weighment logic
                const todayRecord = pluckedRecords.map(record => record.weighmentNumber);
                const lastRecord = pluckedRecords[pluckedRecords.length - 1];
                const lastRecordTime = lastRecord?.recordTime ?? 0;

                if (lastRecordTime && Date.now() >= lastRecordTime + 5 * 60 * 1000) {
                    setWeighment(WEIGHMENTDATA[todayRecord.length >= 4 ? 4 : todayRecord.length]);
                } else {
                    setWeighment(WEIGHMENTDATA[0]);
                }
            } catch (err) {
                console.error('WatermelonDB fetch error:', err);
            }
        };

        fetchData();
    }, []);

    return {
        section,
        setSection,
        allSection,
        allBatch,
        allShift,
        allKamjari,
        batch,
        shift,
        kamjari,
        setKamjari,
        setBatch,
        setShift,
        weighment,
        setWeighment,
        WEIGHMENTDATA,
        handleNext,
        locationLoading,
        handleLogs,
    };
};

export default useRecordPluckingInDetails;
