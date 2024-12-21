import prisma from '@/utils/dp'
import CardForAdmin from '@/components/CardForAdmin'
import formatNumber from 'format-number'

async function getSalesData() {
    const data =prisma.order.aggregate({
        _sum:{priceInCents:true},
        _count:true,
        
    })
    return{
        amount:((await data)._sum.priceInCents||0)/100,
        numberOfSales:(await data)._count
    }
        
    
}
async function getUsersData() {
    const [usersCount ,orderData ] = await Promise.all([
        prisma.user.count(),
        prisma.order.aggregate({
            _sum:{priceInCents:true}
        })
    ])
    return{
        usersCount,
        averageValuePerUsers
         : usersCount===0?0:(orderData._sum.priceInCents||0)/usersCount/100
    }

}
async function getProductsData() {
    const [activeProducts , inActiveProducts] = await Promise.all([
        prisma.product.count({where:{isAvailableForPurchase:true}}),
        prisma.product.count({where:{isAvailableForPurchase:false}})
    ])
    return{
        activeProducts,inActiveProducts
    }
}
async function page() {
    const[salesData , usersData , productsData] = await Promise.all([
        getSalesData(),
        getUsersData(),
        getProductsData()
    ])

    const formatOrder = formatNumber({ prefix: "", integerSeparator: "," });
    const formatCurrency = formatNumber({ prefix: "$", integerSeparator: "," });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardForAdmin title='Sales' 
        dec={`${formatOrder(salesData.amount)} Orders`}
        body={formatCurrency(salesData.numberOfSales)}/>
        <CardForAdmin title='Customer' 
        dec={`${formatOrder(usersData.averageValuePerUsers)} Average Value`}
        body={formatOrder(usersData.usersCount)}/>
        <CardForAdmin title='Active Products' 
        dec={`${formatOrder(productsData.inActiveProducts)}  Inactive`}
        body={formatOrder(productsData.activeProducts)}/>
    </div>
  )
}   

export default page