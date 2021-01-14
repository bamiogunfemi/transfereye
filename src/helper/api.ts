import {useState, useEffect} from 'react'

const KEY = 'sk_test_989530def61b2cc699811fbe28d0f0c7deb637bd'
export const BASE_URL ='https://api.paystack.co'

export const authorization= {
  'Authorization':`Bearer ${KEY}` ,
}
export const getHeaders ={ 
  method:'GET',
  headers: authorization,
}
export const useFetch = (url:string, headers:any ) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, headers)
        const data = await res.json();
        await setResponse(data.data);
        setIsLoading(false);
      } catch (error) {
        await setError(error);
      }
    };
    fetchData();
  }, [url,headers]);
  return { response, error, isLoading };
};

export const useFetchPost = (url:string, params:any ) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          method:'POST',
          headers: authorization,
          body:JSON.stringify(params)
        })
        const data = await res.json();
        await setResponse(data.data);
        setIsLoading(false);
      } catch (error) {
        await setError(error);
      }
    };
    fetchData();
  }, [params,url]);
  return { response, error, isLoading };
};

export const createTransferReciept=(user: any)=>{
  fetch(`${BASE_URL}/transferrecipient`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: authorization,
  })
  .then(response => response.json()) 
  .then(json => console.log(json))
  .catch(err => console.log(err));
}
