export const postData = async (
    url: string,
    data?: any,
    isMultipartPost?: boolean,
    isStringify?: boolean,
) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': isMultipartPost
                ? 'multipart/form-data'
                : 'application/json',
        },
        body: isMultipartPost
            ? (data as FormData)
            : isStringify
            ? data
            : JSON.stringify(data),
    };

    const res = await fetch(url, options);

    if (!res.ok) {
        console.error(res);
        throw new Error('Something went wrong');
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
