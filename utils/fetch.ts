export const fetchToN8N = async (url: string, method: string, body: string, retry: number = 0): Promise<{ success: boolean } | undefined> => {
  try {
    const jsonBody = body.replace(/(\r\n|\n|\r)/gm, "").split("<{{,}}>").reduce((result, current) => {
      const [key, value] = current.split("<{{=}}>");
      
      if(key === undefined) return result;
      
      return {
        ...result,
        [key]: value,
      };
    }, {});

    if(method === "GET") {
      await fetch(`${url}?${new URLSearchParams(jsonBody)}`);
    } else {
      await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonBody),
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    if(retry < 3) {
      console.log(`Retrying fetch to N8N ${retry + 1} times`);
      setTimeout(async () => fetchToN8N(url, method, body, retry + 1), 1000);
    } else {
      console.log(`Failed to fetch from N8N: ${error}`);
      return {
        success: false,
      };
    }
  }
};
