const buckets=new Map<string,{count:number;reset:number}>();
export function rateLimit(key:string,limit=10,windowMs=60000){const now=Date.now(),entry=buckets.get(key);if(!entry||entry.reset<now){buckets.set(key,{count:1,reset:now+windowMs});return true}if(entry.count>=limit)return false;entry.count++;return true}
