import { useState, useEffect } from 'react';
import './test.css'

// 水合报错探索
const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  };

export default function Test({ initialData }) {
    const [data, setData] = useState(initialData.count);

    useEffect(() => {
        setData(10);
    }, []);

    return (
        <div className='test'>
            <div>{data}</div>
        </div>
    )
}

export async function getServerSideProps() {
    const res = await fetch('http://localhost:3000/api/test', {
        headers: headers
    });
    const initialData = await res.json();
    console.log(initialData);

    return {
        props: {
            initialData
        }
    }
}
