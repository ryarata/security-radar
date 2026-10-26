const string={type:'string'};
const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const enumeration=values=>({type:'string',enum:values});
export const reportSchema=object({
 summary:string,coverage:object({x:string,official:string}),
 items:{type:'array',maxItems:8,items:object({
  id:string,title:string,priority:enumeration(['今日確認','利用確認','動向把握']),change:enumeration(['新規','更新','継続']),
  tags:{type:'array',items:string},summary:string,reason:string,affected:string,check:string,action:string,
  verification:enumeration(['公式確認済み','未確認']),
  sources:{type:'array',minItems:1,items:object({title:string,url:string,kind:enumeration(['公式','X','参考'])})}
 })}
});
