import React from 'react';
import { StyleSheet, View } from 'react-native';
import Pdf from 'react-native-pdf';
import PageLoading from './LottieComponent/PageLoading';

interface PDFViewerProps {
    pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri: pdfUrl, cache: true }} // Use the `source` prop with `uri`
                onLoadComplete={numberOfPages => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={page => {
                    console.log(`Current page: ${page}`);
                }}
                onError={error => {
                    console.log('Error loading PDF:', error);
                }}
                onPressLink={uri => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
                // enablePaging={true} // Enable swipe gestures for pagination
                renderActivityIndicator={() => <PageLoading />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default PDFViewer;
