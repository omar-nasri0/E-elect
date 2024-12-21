import {Card, CardContent, CardDescription, CardHeader} from '@/components/ui/card'
interface prop{
    title:string,
    dec:string,
    body:string
}
function CardForAdmin({title , dec , body}:prop) {
  return (
    <Card className='pl-4' >
        <CardHeader className='mb-0 p-0'>{title}</CardHeader>
        <CardDescription>{dec}</CardDescription>
        <CardContent className='p-0 mt-4'>
            <p>{body}</p>
        </CardContent>
        </Card>
  )
}

export default CardForAdmin