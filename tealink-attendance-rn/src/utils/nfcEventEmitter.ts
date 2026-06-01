import mitt from 'mitt';

export type NfcTag = {
    id: string | number;
    ndefMessage?: any[];
    // Add other fields you use
};

type Events = {
    tag: NfcTag;
};

const emitter = mitt<Events>();

export const nfcEventEmitter = {
    emitTag: (tag: NfcTag) => emitter.emit('tag', tag),

    onTag: (handler: (tag: NfcTag) => void) => {
        emitter.on('tag', handler);
        return () => emitter.off('tag', handler);
    },
};
