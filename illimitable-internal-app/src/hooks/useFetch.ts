import {useState, useEffect, useContext} from 'react';
import {Alert, ToastAndroid} from 'react-native';
import {useAuthStore} from '../store/authStore';
import {useNavigation} from './useNavigation';
// import {AuthContext} from '../context/AuthContext';

interface FetchResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    message: string;
}
const useFetch = <T = any>(url: string, options: RequestInit = {}, dependencyArray: any[] = []): FetchResult<T> => {
    const [data, setData] = useState(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const {logout} = useAuthStore();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log(result);

                if (result.status === true) {
                    setData(result);
                    setMessage(''); // Clear message if data is successfully fetched
                } else {
                    setMessage(result.msg); // Store the message when status is false
                }

                if (result?.tokenExpired) {
                    Alert.alert('Session Expired', 'Your session has expired. Please login again.', [
                        {
                            text: 'OK',
                            onPress: () => {
                                logout();
                                navigation.replace('Login');
                            },
                        },
                    ]);
                }
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencyArray);

    return {data, error, loading, message};
};

export default useFetch;
