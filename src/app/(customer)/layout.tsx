import {Nav , NavLink} from '@/components/Nav'
export const dynamic = 'force-dynamic'
export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
      <Nav> 
        <NavLink href="/" >Home</NavLink>
        <NavLink href="/products" >Products</NavLink>
      </Nav>
      <div className="container m-6">
        {children}
        </div>
        </>
    );
  }