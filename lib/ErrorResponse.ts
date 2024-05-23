export default function ErrorResponse(error : any, status? : number){
  return Response.json({error : error.message || error.toString() || "Unknown Error Occured"}, {status : status || 500})
} 
