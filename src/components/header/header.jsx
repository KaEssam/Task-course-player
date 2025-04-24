import { BreadcrumbItem, Breadcrumb, Container } from "reactstrap";

export default function Header() {
    return (
        <header className='pageheader'>
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem >Home</BreadcrumbItem>
                    <BreadcrumbItem className='bi'>Courses</BreadcrumbItem>
                    <BreadcrumbItem active className='bi'>Course Details</BreadcrumbItem>
                </Breadcrumb>
                <h1 className='coursetitle'>Starting SEO as your Home</h1>
            </Container>
        </header>
    )
}
