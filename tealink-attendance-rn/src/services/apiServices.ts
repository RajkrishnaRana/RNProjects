// Update your existing postData function to accept response type
export const postData = async (url: string, data?: any, isMultipartPost?: boolean, responseType: 'json' | 'blob' | 'text' = 'json') => {
    const options: RequestInit = {
        method: 'POST',
        body: isMultipartPost ? (data as FormData) : JSON.stringify(data),
    };

    if (!isMultipartPost) {
        options.headers = {
            'Content-Type': 'application/json',
        };
    }
    // else if (isMultipartPost) {
    //     options.headers = {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     };
    // }

    const res = await fetch(url, options);

    if (!res.ok) {
        console.error('Response not ok:', res.status, res.statusText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    // Handle different response types
    if (responseType === 'blob') {
        return res.blob(); // Returns blob for binary data
    } else if (responseType === 'text') {
        return res.text(); // Returns text
    } else {
        return res.json(); // Default behavior
    }
};

export const getData = async (url: string) => {
    const res = await fetch(url);
    console.log(url);

    if (!res.ok) {
        throw new Error('Something went wrong');
    }

    return res.json();
};
