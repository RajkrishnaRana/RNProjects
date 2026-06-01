import { useAppSelector } from '../typedReduxHooks';
import { makeProfileIconText } from '../../utils/textHelper';


const useSidebarMenu = () => {
    // GLOBAL STATES ------------->
    const { userData } = useAppSelector(state => state.auth);

    return {
        profileIcon: makeProfileIconText(userData?.name || ''),
        online: useAppSelector(state => state.network.online),
    };
};

export default useSidebarMenu;
