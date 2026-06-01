export const postData = async (url: string, data?: any, isMultipartPost?: boolean) => {
    const options: RequestInit = {
        method: 'POST',
        body: isMultipartPost ? (data as FormData) : JSON.stringify(data),
    };

    if (!isMultipartPost) {
        options.headers = {
            'Content-Type': 'application/json',
        };
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        console.error('Response not ok:', res.status, res.statusText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
};

export const getData = async (url: string) => {
    const res = await fetch(url);
    console.log(url);

    if (!res.ok) {
        throw new Error('Something went wrong');
    }

    return res.json();
};
