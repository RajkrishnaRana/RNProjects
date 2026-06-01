import { useEffect, useState } from 'react';
import { postData } from '../services/apiServices';
import { useAppDispatch, useAppSelector } from './typedReduxHooks';
import { ToastAndroid } from 'react-native';
import { loginSuccess, setBaseURL } from '../store/slices/authSlice';
import { cleanSlashFromUrl, isValidUrl } from '../utils/urlHelper';

export const useLogin = () => {
    // GLOBAL STATES ------------------------>
    const dispatch = useAppDispatch();
    const { baseURL, loginID, passWord } = useAppSelector(state => state.auth);

    // LOCAL STATES ------------------------->
    const [loginId, setLoginId] = useState(loginID);
    const [password, setPassword] = useState(passWord);
    const [baseUrl, setBaseUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isQRCodeScan, setIsQRCodeScan] = useState(false);

    // FUNCTIONS ----------------------------->

    const handleLogin = async () => {
        if (!loginId || !password) {
            ToastAndroid.show('Please enter your login id', ToastAndroid.SHORT);
            return;
        }

        if (!password) {
            ToastAndroid.show('Please enter your password', ToastAndroid.SHORT);
            return;
        }

        if (!baseUrl) {
            ToastAndroid.show('Please enter your base url', ToastAndroid.SHORT);
            return;
        }

        if (!isValidUrl(baseUrl)) {
            ToastAndroid.show('Please enter a valid base url', ToastAndroid.SHORT);
            return;
        }

        const url = `${cleanSlashFromUrl(baseUrl)}/authenticate-user.json`;
        const payload = {
            loginId: loginId, //deanston.a
            password: password, //123456
            timezoneOffset: new Date().getTimezoneOffset() * 60_000,
            mode: 'APP',
        };

        console.log(url, payload);

        try {
            setLoading(true);
            const res = await postData(url, payload);

            if (!res.status) {
                ToastAndroid.show(String(res.msg || 'Login failed'), ToastAndroid.SHORT);
                return;
            }

            console.log(res);
            dispatch(loginSuccess({ userData: res?.doc, loginId: loginId, password: password }));
            dispatch(setBaseURL(cleanSlashFromUrl(baseUrl)));
        } catch (err: any) {
            const msg = err?.response?.msg ?? err?.msg ?? 'Something went wrong';
            ToastAndroid.show(msg, ToastAndroid.SHORT);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const onQRCodeScanned = (codes: any[]) => {
        if (codes.length > 0) {
            console.log(codes[0].value);
            setBaseUrl(codes[0].value);
        }
    };

    // SIDE EFFECTS --------------------------->
    useEffect(() => {
        if (baseURL) {
            setBaseUrl(baseURL);
        }
    }, [baseURL]);

    return {
        loginId,
        setLoginId,
        password,
        setPassword,
        baseUrl,
        setBaseUrl,
        handleLogin,
        loading,
        isQRCodeScan,
        setIsQRCodeScan,
        onQRCodeScanned,
    };
};
