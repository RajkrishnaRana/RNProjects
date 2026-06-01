import {create} from 'zustand';

interface SignUpStates {
    firstName: string;
    lastName: string;
    mobile: string;
    _id: string;
    profiles: Profile[];
    setIsSignUp: (
        firstName: string,
        lastName: string,
        mobile: string,
        _id: string,
    ) => void;
    setProfiles: (profiles: Profile[]) => void;
}

export const useSignUpStore = create<SignUpStates>(set => ({
    firstName: '',
    lastName: '',
    mobile: '',
    _id: '',
    profiles: [],
    setIsSignUp: (firstName, lastName, mobile, _id) =>
        set({
            firstName: firstName,
            lastName: lastName,
            mobile: mobile,
            _id: _id,
        }),

    setProfiles: profiles => set({profiles: profiles}),
}));
