import Sound from "react-native-sound";

const soundServices = {
    playSuccessSound: () => {
        const beep = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            // Play the sound with an onEnd callback
            beep.play((success) => {
                if (!success) {
                    console.log('Playback failed due to audio decoding errors');
                }
                // Release the audio resource after playing
                beep.release();
            });
        });
    }
}

export default soundServices;
