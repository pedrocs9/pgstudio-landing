import Nav      from './components/nav'
import Hero     from './components/hero'
import Products from './components/products'
import Custom from './components/custom'
import Why      from './components/why'
import How      from './components/how'
import Cta      from './components/cta'
import Footer   from './components/footer'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <Why />
        <How />
        <Custom />
        <Cta />
      </main>
      <Footer />
    </>
  )
}