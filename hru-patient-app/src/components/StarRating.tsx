import {View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isTab} from '../utils/isTab';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const StarRating = ({rating}: {rating: number | undefined}) => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <View style={{flexDirection: 'row'}}>
            {[...Array(fullStars)].map((_, i) => (
                <AntDesign key={`full-${i}`} name="star" size={isTab ? wp(2) : 16} color="#FFD700" />
            ))}
            {halfStar && <AntDesign name="staro" size={isTab ? wp(2) : 16} color="#FFD700" />}
            {[...Array(emptyStars)].map((_, i) => (
                <AntDesign key={`empty-${i}`} name="staro" size={isTab ? wp(2) : 16} color="#FFD700" />
            ))}
        </View>
    );
};

export default StarRating;
