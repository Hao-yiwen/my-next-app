export function cors(req, res) {
  // 允许的源，在开发环境下允许 localhost:3001
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : process.env.NEXT_PUBLIC_API_URL
  );
  
  // 允许的方法
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // 允许的请求头
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
  );

  // 允许携带凭证
  res.setHeader('Access-Control-Allow-Credentials', true);

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
} 