package in.illimitable.nfc;

import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.Tag;
import android.nfc.tech.MifareClassic;
import android.nfc.tech.Ndef;

public class NFCUtil {

    private static final byte[] SECTOR_TRAILER_ORG =
            {(byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0x07, (byte) 0x80, (byte) 0x69, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF};

    private static final byte[] BLOCK_1 =
            {(byte) 0x14, (byte) 0x01, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1};

    private static final byte[] BLOCK_2 =
            {(byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1};

    private static final byte[] BLOCK_3 =
            {(byte) 0xA0, (byte) 0xA1, (byte) 0xA2, (byte) 0xA3, (byte) 0xA4, (byte) 0xA5, (byte) 0x78, (byte) 0x77, (byte) 0x88, (byte) 0xC1, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF};

    private static final byte[] BLOCK_7 =
            {(byte) 0xD3, (byte) 0xF7, (byte) 0xD3, (byte) 0xF7, (byte) 0xD3, (byte) 0xF7, (byte) 0x7F, (byte) 0x07, (byte) 0x88, (byte) 0x40, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF};

    private static final byte[] EMPTY_BLOCK =
            {(byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00};

    private static byte[] BLOCK_4_TEMPLATE =
            {(byte) 0x00, (byte) 0x00, (byte) 0x03, (byte) 0x10, (byte) 0xD1, (byte) 0x01, (byte) 0x0C, (byte) 0x55, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00};

    private static byte[] BLOCK_5_TEMPLATE =
            {(byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0xFE, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00};

    private static final char[] hexArray = "0123456789abcdef".toCharArray();

    private static byte[] keySpl = {(byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1, (byte) 0x03, (byte) 0xE1};

    private byte[] keyA;
    private byte[] keyB;
    private byte[] sectorTrailer;
    private String seed;

    private static NFCUtil nfcUtil;

    private NFCUtil(String seed) {
        this.seed = seed;
    }

    public static NFCUtil getInstance(String seed){
        if(nfcUtil == null){
            nfcUtil = new NFCUtil(seed);
            nfcUtil.setupKeysAndSectorTrailer();
        }
        return nfcUtil;
    }

    private byte[] hexStringToByteArray(String s) {
        byte[] b = new byte[s.length() / 2];
        for (int i = 0; i < b.length; i++) {
            int index = i * 2;
            int v = Integer.parseInt(s.substring(index, index + 2), 16);
            b[i] = (byte) v;
        }
        return b;
    }

    private byte[] inputToBlock(String input) {
        byte[] value = hexStringToByteArray(input);
        byte[] toWrite = new byte[MifareClassic.BLOCK_SIZE];

        for (int i = 0; i < MifareClassic.BLOCK_SIZE; i++) {
            if (i < value.length) toWrite[i] = value[i];
            else toWrite[i] = 0;
        }
        return toWrite;
    }

    private String bytesToHexString(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    public String readData(Tag tag) throws Exception {
        String data = "";
        Ndef ndef = Ndef.get(tag);
        if (ndef != null) {
            NdefMessage ndefMessage = ndef.getCachedNdefMessage();
            if(ndefMessage!=null){
                NdefRecord[] records = ndefMessage.getRecords();
                for (NdefRecord ndefRecord : records) {
                    byte[] rawBytes = ndefRecord.getPayload();
                    data =  bytesToHexString(rawBytes);
                    break;
                }
            }else{
                try {
                    MifareClassic mfc = MifareClassic.get(tag);
                    if(mfc != null) {
                        mfc.connect();
                        boolean auth = mfc.authenticateSectorWithKeyA(1, keyA);
                        if (auth) {
                            byte[] bytes = mfc.readBlock(4);
                            data = bytesToHexString(bytes);
                            if (data.length() > 24) {
                                data = data.substring(0, 24);
                            }
                        }
                        mfc.close();
                    }
                }catch (Throwable e){}
            }
        }
        return data;
    }

    public boolean writeData(Tag tag, String input) throws Exception {
        boolean returnFlag = false;
        MifareClassic mfc = MifareClassic.get(tag);
        if(mfc==null){
            return returnFlag;
        }
        boolean auth = false;
        mfc.connect();
        int secCount = mfc.getSectorCount();
        int bIndex = 0;
        int bCount = 0;
        for (int j = 0; j < secCount; j++) {
            auth = mfc.authenticateSectorWithKeyA(j, MifareClassic.KEY_DEFAULT);
            if (!auth) {
                auth = mfc.authenticateSectorWithKeyA(j, keyA);
            }
            if (auth) {
                bCount = mfc.getBlockCountInSector(j);
                bIndex = mfc.sectorToBlock(j);
                for (int i = 0; i < bCount; i++) {
                    if (bIndex > 0) {
                        if (i != bCount - 1) {
                            if (j == 1 && i == 0) {
                                mfc.writeBlock(bIndex, inputToBlock(input));
                            }
                        } else {
                            mfc.writeBlock(bIndex, sectorTrailer);
                        }
                    }
                    bIndex++;
                }
                returnFlag = true;
            }
        }
        mfc.close();
        return returnFlag;
    }

    public boolean writeNdef(Tag tag, String input) throws Exception {
        boolean returnFlag = false;
        MifareClassic mfc = MifareClassic.get(tag);
        if(mfc==null){
            return returnFlag;
        }
        boolean auth = false;
        mfc.connect();
        int secCount = mfc.getSectorCount();
        int bIndex = 0;
        int bCount = 0;
        byte[][]blocks = getBlock4And5(input);
        for (int j = 0; j < secCount; j++) {
            auth = mfc.authenticateSectorWithKeyB(j, MifareClassic.KEY_DEFAULT);
            if (!auth) {
                auth = mfc.authenticateSectorWithKeyA(j, keyA);
            }
            if (auth) {
                bCount = mfc.getBlockCountInSector(j);
                bIndex = mfc.sectorToBlock(j);
                for (int i = 0; i < bCount; i++) {
                    if(bIndex==1){
                        mfc.writeBlock(bIndex, BLOCK_1);
                    }else if(bIndex==2){
                        mfc.writeBlock(bIndex, BLOCK_2);
                    }else if(bIndex==3){
                        mfc.writeBlock(bIndex, BLOCK_3);
                    }else if(bIndex==4){
                        mfc.writeBlock(bIndex, blocks[0]);
                    }else if(bIndex==5){
                        mfc.writeBlock(bIndex, blocks[1]);
                    }else if(bIndex==7){
                        mfc.writeBlock(bIndex, BLOCK_7);
                    }
                    bIndex++;
                }
                returnFlag = true;
            }
        }
        mfc.close();
        return returnFlag;
    }

    public boolean formatMifare(Tag tag) throws Exception {
        boolean returnFlag = false;
        MifareClassic mfc = MifareClassic.get(tag);
        if(mfc==null){
            return returnFlag;
        }
        boolean auth = false;
        mfc.connect();
        int secCount = mfc.getSectorCount();
        int bIndex = 0;
        int bCount = 0;
        for (int j = 0; j < secCount; j++) {
            auth = mfc.authenticateSectorWithKeyB(j, MifareClassic.KEY_DEFAULT);
            if (!auth) {
                auth = mfc.authenticateSectorWithKeyA(j, keyA);
            }
            if (auth) {
                bCount = mfc.getBlockCountInSector(j);
                bIndex = mfc.sectorToBlock(j);
                for (int i = 0; i < bCount; i++) {
                    if (bIndex > 0) {
                        if (i != bCount - 1) {
                            mfc.writeBlock(bIndex, EMPTY_BLOCK);
                        } else {
                            mfc.writeBlock(bIndex, SECTOR_TRAILER_ORG);
                        }
                    }
                    bIndex++;
                }
                returnFlag = true;
            }
        }
        mfc.close();
        return returnFlag;
    }

    private byte[][] getBlock4And5(String input){
        byte[] bytes = hexStringToByteArray(input);
        byte[][] blocks = new byte[2][];
        blocks[0] = BLOCK_4_TEMPLATE.clone();
        blocks[1] = BLOCK_5_TEMPLATE.clone();
        int loop=0;
        for(; loop<8;loop++){
            blocks[0][8+loop] = bytes[loop];
        }
        for(int length = bytes.length; loop<length;loop++){
            blocks[1][loop-8] = bytes[loop];
        }
        return blocks;
    }

    private void setupKeysAndSectorTrailer() {
        String keyBStr = seed.substring(0, 12).toUpperCase();
        String keyAStr = seed.substring(12).toUpperCase();
        keyA = hexStringToByteArray(keyAStr);
        keyB = hexStringToByteArray(keyBStr);
        if (keyA.length != 6 || keyB.length != 6) {
            throw new Error("Invalid KeyA|KeyB");
        }
        sectorTrailer = new byte[MifareClassic.BLOCK_SIZE];
        System.arraycopy(keyA, 0, sectorTrailer, 0, 6);
        System.arraycopy(keyB, 0, sectorTrailer, 10, 6);
        sectorTrailer[6] = (byte) 0xFF;
        sectorTrailer[7] = (byte) 0x07;
        sectorTrailer[8] = (byte) 0x80;
        sectorTrailer[9] = (byte) 0x69;
    }
}
