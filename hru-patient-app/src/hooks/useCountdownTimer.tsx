import {useState, useEffect, useCallback} from 'react';
import moment from 'moment';

interface TimerState {
    formattedTime: string;
    isTimerRunning: boolean;
    secondsLeft: number;
    restartTimer: () => void;
    setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
    setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

const useCountdownTimer = (initialSeconds: number = 30): TimerState => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    const formatTime = useCallback((seconds: number) => {
        return moment.utc(seconds * 1000).format('mm:ss');
    }, []);

    const restartTimer = useCallback(() => {
        setSecondsLeft(initialSeconds);
        setIsTimerRunning(true);
    }, [initialSeconds]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isTimerRunning && secondsLeft > 0) {
            timer = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        clearInterval(timer!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isTimerRunning, secondsLeft]);

    return {
        formattedTime: formatTime(secondsLeft),
        isTimerRunning,
        secondsLeft,
        restartTimer,
        setSecondsLeft,
        setIsTimerRunning,
    };
};

export default useCountdownTimer;
