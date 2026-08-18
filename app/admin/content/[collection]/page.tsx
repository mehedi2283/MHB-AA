import { ContentManager } from "@/components/ContentManager";
export default async function Page({params}:{params:Promise<{collection:string}>}){const {collection}=await params;return <ContentManager collection={collection}/>}
