
export async function handler(event:any) {
    console.log(event);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json"},
        body: "World" 
    };
}