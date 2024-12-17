export async function fetchData(url, method = 'GET', data ) {
    console.log(data);
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return { data: responseData, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}
